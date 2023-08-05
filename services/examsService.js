const Exam = require('../models/examination');
const patientsService = require('./patientsService');
const cryptoService = require('./cryptoService');
const eventService = require('./eventService');
const userService = require('./usersService');
const crudLogger = require('../middlewares/crudLogger');
const ObjectId = require('mongoose').Types.ObjectId;
const resourceLockService = require('./resourceLockService');
const getDate = require('../controllers/utils').getDate;

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
        const patientExams = await Exam.find({ patient: new ObjectId(patientId) });
        if (patientExams && patientExams.length) {
            for (let i = 0; i < patientExams.length; i++) {
                crudLogger('Exam deleted', req => ({ examId: patientExams[i]._id, reason: 'automatic removal: patient deleted' }))({ user: {} }, {}, () => ({}));
            }
            await Exam.deleteMany({ patient: new ObjectId(patientId) });
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
        encryptExamNotes(examData);
        exam.notes = examData.notes;
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
    switch (action) {
        case 'added':
            fn = async ({ examId, consId }) => {
                try {
                    const exam = await Exam.findById(examId);
                    // if an exam was deleted before a cons was added, the cons shouldn't be able to be added
                    if (!exam) throw new ExamNotFound();
                    exam.hasConsultation = true;
                    exam.consultation = new ObjectId(consId);
                    await exam.save();
                    return;
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
            break;
        case 'removed':
            fn = async ({ consId, examId }) => {
                try {
                    const exam = await Exam.findById(examId);
                    // exam may be deleted after a cons was added, do not throw
                    if (!exam) return;
                    exam.hasConsultation = false;
                    await exam.save();
                    await exam.populate('patient');
                    await userService.notifyUser(exam.examiner, {
                        consultation: exam._id,
                        action: 'ConsRemoved',
                        status: 'New',
                        href: `/portal/exams/${examId}`,
                        message: `A consultation was removed from your exam of ${exam.patient.name} dated ${getDate(exam.date)}`,
                    });
                    return;
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
            break;
        case 'updated':
            fn = async ({ examId, consNotes, retinopathyDiagnosis }) => {
                try {
                    if (!examId) return;
                    const exam = await Exam.findById(examId);
                    if (!exam) throw ExamNotFound();
                    await exam.populate('patient')
                    await userService.notifyUser(exam.examiner, {
                        resource: exam._id,
                        action: 'ConsUpdated',
                        status: 'New',
                        href: `/portal/exams/${examId}/consultation`,
                        message: `Consultation was added for your exam of ${exam.patient.name} dated ${getDate(exam.date)}:<br>${retinopathyDiagnosis}: ${consNotes.substring(0, Math.max(20, consNotes.length))}...`,
                    });
                    return;
                } catch (error) {
                    console.error(error);
                    throw error;
                }
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
                'images': new ObjectId
                    (eventData.imageId)
            }
        });
        await exam.save();
    } catch (error) {
        console.error(error);
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
//         console.error(error);
//         throw error;
//     }
// }
// resourceLockService.autoRespond(shouldRespond,locateId);

eventService.on('patientDeleted', onPatientDeleted);
eventService.on('imageCreated', onImageCreated);
//eventService.on('imageDeleted');

eventService.on('consultationCreated', onConsultationActionFactory('added'));
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