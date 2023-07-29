const Exam = require('../models/examination');
const patientsService = require('./patientsService');
const cryptoService = require('./cryptoService');
const eventService = require('./eventService');
const crudLogger = require('../middlewares/crudLogger');
const ObjectId = require('mongoose').Types.ObjectId;
const resourceLockService = require('./resourceLockService');

const getExamsOfPatient = async patientId => {
    try {
        // const exams = await Exam.find({ patient: patientId }).sort({ updatedAt: -1 });
        // if (exams.length) {
        //     exams.forEach(exam => decryptExamNotes(exam));
        // }
        // return exams;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getExamsFiltered = async (filter, sort, collation, skip, limit) => {
    try {
        const totalQuery = await Exam.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'examiner',
                    foreignField: '_id',
                    as: 'examiner'
                },
            },
            { $unwind: { path: '$examiner' } },
            {
                $unset: ['examiner.email', 'examiner.password', 'examiner.validationStatus', 'examiner.notifications', 'examiner.additionalInfo'],
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patient',
                }
            },
            { $unwind: '$patient' },
            {
                $addFields: {
                    numImages: { $size: '$images' },
                }
            },
            { $match: filter },
            { $sort: sort },
        ]).collation(collation);

        const totalCount = totalQuery.length;
        const paginatedQuery = totalQuery.slice(skip, skip + limit);
        paginatedQuery.forEach(q => decryptExamNotes(q));
        return {
            totalCount: totalCount,
            exams: paginatedQuery
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const createExamForPatient = async (patientId, examinerId, examData) => {
    try {
        const patient = await patientsService.getPatientById(patientId);
        try {
            examData.patient = patient._id;
            examData.examiner = examinerId;
            examData.notes = examData.notes || '';
            encryptExamNotes(examData);
            const exam = await Exam.create(examData);
            await eventService.emitEvent('examCreated', { examId: exam._id, patientId: patient._id });
            return decryptExamNotes(exam._doc);
        } catch (e) {
            console.error(e);
            throw new CouldNotCreateExam();
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const findById = async id => {
    try {
        const results = await Exam.aggregate([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'examiner',
                    foreignField: '_id',
                    as: 'examiner'
                },
            },
            { $unwind: { path: '$examiner' } },
            {
                $unset: ['examiner.email', 'examiner.password', 'examiner.validationStatus', 'examiner.notifications', 'examiner.additionalInfo'],
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patient',
                }
            },
            { $unwind: '$patient' }
        ]);
        if (results && results.length) {
            return decryptExamNotes(results[0]);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const deleteExamById = async (id, mustBeCreatedBy = null) => {
    try {
        const exam = await Exam.findById(id);
        if (exam) {
            if (mustBeCreatedBy) {
                if (exam.examiner.toString() !== mustBeCreatedBy) throw new NotAllowed();
            }
            await eventService.emitEvent('examDeleted', { examId: exam._id, patientId: exam.patient._id });
            await exam.deleteOne();
        } else {
            throw new ExamNotFound();
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}



const onPatientDeleted = async ({ patientId }) => {
    try {
        const patientExams = await Exam.find({ patient: patientId });
        if (patientExams && patientExams.length) {
            for (let i = 0; i < patientExams.length; i++) {
                await eventService.emitEvent('examDeleted', { examId: patientExams[i]._id, patientId: patientId });
                crudLogger('Exam deleted', req => ({ id: patientExams[i]._id, reason: 'automatic removal: patient deleted' }))({}, {}, () => ({}));
            }
            await Exam.deleteMany({ patient: id });
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const updateExamNotes = async (id, examData, mustBeUpdatedBy = null) => {
    try {
        const exam = await Exam.findById(id);
        if (!exam) {
            throw new ExamNotFound();
        }
        if (mustBeUpdatedBy && exam.examiner.toString() !== mustBeUpdatedBy) {
            throw new NotAllowed();
        }
        exam.notes = examData.notes;
        encryptExamNotes(exam);
        await exam.save();
        await eventService.emitEvent('examNotesUpdated', { examId: exam._id, patientId: exam.patient._id });
        return decryptExamNotes(exam._doc);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const onConsultationActionFactory = (action) => {
    let fn;
    // TODO add consultation change functions
    switch (action) {
        case 'added':
            fn = ({ }) => {

            }
            break;
        case 'removed':
            fn = ({ }) => {

            }
            break;
        case 'updated':
            fn = ({ }) => {

            }
            break;
    }
    return fn;
}

const encryptExamNotes = exam => {
    if (exam.notes) {
        exam.notes = cryptoService.encryptText(exam.notes);
    }
    return exam;
}

const decryptExamNotes = exam => {
    if (exam.notes) {
        exam.notes = cryptoService.decryptText(exam.notes);
    }
    return exam;
}

class CouldNotCreateExam extends Error {
    constructor(msg = 'Couldn\'t Create Exam!') {
        super(msg);
        this.name = 'CouldNotCreateExamError';
    }
}

class ExamNotFound extends Error {
    constructor(msg = 'Exam Not Found!') {
        super(msg);
        this.name = 'ExamNotFoundError';
    }
}

class NotAllowed extends Error {
    constructor(msg = "Not Allowed To Do This Action!") {
        super(msg);
        this.name = 'NotAllowedError';
    };
}

const onImageCreated = async (eventData) => {
    try {
        const exam = await Exam.findById(eventData.examId);
        if (!exam) throw new ExamNotFound();
        await exam.updateOne({
            $push: {
                'images': new Object
                    (eventData.id)
            }
        });
        await exam.save();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// const onResourceLockRequest = async data => {
//     if (!data.eventData.schema.match(/exam\i/)) return;
//     try {
//         const exam = await Exam.findById(data.eventData.id);
//         if (!exam) throw new ExamNotFound('Resource not found');
//     } catch (error) {
//         console.error(error);
//         eventService.handleEventResponse('resourceLockRequest', { failure: error, correlationId: data.correlationId });
//     }
// }

// const shouldRespond = (data) => {
//     return (data.schema.match(/exam\i/));
// }

// const locateId = async (data) => {
//     const { eventData, releaseRequest } = data;
//     if (releaseRequest) return eventData.id;
//     try {
//         const exam = await Exam.findById(eventData.id);
//         if (!exam)
//             throw new ExamNotFound();
//         return eventData.id;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }
// resourceLockService.autoRespond(shouldRespond,locateId);

eventService.on('patientDeleted', onPatientDeleted);
eventService.on('imageCreated', onImageCreated);
//eventService.on('imageDeleted');

eventService.on('consultationAdded', onConsultationActionFactory('added'));
eventService.on('consultationUpdated', onConsultationActionFactory('updated'));
eventService.on('consultationDeleted', onConsultationActionFactory('removed'));

module.exports = {
    getExamsOfPatient,
    createExamForPatient,
    getExamsFiltered,
    findById,
    deleteExamById,
    updateExamNotes,
}