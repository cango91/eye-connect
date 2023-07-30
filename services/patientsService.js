const Patient = require('../models/patient');
const eventService = require('./eventService');

const tempIgnoreIds = [];

const getPatientById = async patientId => {
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) throw new PatientNotFound('Patient not found!');
        return patient;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const deletePatientById = async id => {
    try {
        const patient = await Patient.findById(id);
        if (patient) {
            tempIgnoreIds.push(id);
            await eventService.emitEvent('patientDeleted', {patientId:id}); //examsService.onPatientDeleted(id);
        } else {
            throw new PatientNotFound('Patient not found!');
        }
        await Patient.findByIdAndDelete(id);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getPatientsFiltered = async (filter, sort, collation, skip, limit) => {
    try {
        const patients = await Patient.find(filter).sort(sort).collation(collation).limit(limit).skip(skip);
        return patients;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getPatientsWithLatestExamDate = async (filter, sort, collation, skip, limit) => {
    try {
        // Query without skip and limit for total count
        const totalQuery = await Patient.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'examinations',
                    localField: 'exams',
                    foreignField: '_id',
                    as: 'exams'
                }
            },
            { $unwind: { path: '$exams', preserveNullAndEmptyArrays: true } },
            { $sort: { 'exams.date': -1 } },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    dateOfBirth: { $first: '$dateOfBirth' },
                    gender: { $first: '$gender' },
                    exams: { $push: '$exams' },
                    latestExamDate: { $first: '$exams.date' }
                }
            },
            { $addFields: { numExams: { $size: "$exams" } } },
            { $sort: sort },

        ]).collation(collation);

        const totalCount = totalQuery.length;

        // Query with skip and limit for paginated results
        const paginatedQuery = totalQuery.slice(skip, skip + limit);

        return {
            totalCount: totalCount,
            patients: paginatedQuery
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
}


const updatePatientExams = async ({ patientId, examId }) => {
    try {
        const patient = await Patient.findById(patientId);
        if (patient.exams.findIndex((id) => id.toString() === examId.toString()) === -1) {
            patient.exams.push(examId);
            await patient.save();
        } else {
            throw new Error('Duplicate Exam Id');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const deleteExamFromPatient = async ({ examId, patientId }) => {
    try {
        if(tempIgnoreIds.includes(patientId)){
            tempIgnoreIds.splice(tempIgnoreIds.findIndex(id=>id===patientId),1);
            return;
        }
        const patient = await Patient.findById(patientId);
        if (!patient) throw new PatientNotFound();
        // const arrayIdx = patient.exams.findIndex(exam => exam === examId);
        // if (arrayIdx < 0) throw new Error('Exam not found on patient');
        // patient.exams.splice(arrayIdx, 1);
        patient.updateOne({$pull:{'exams': {_id:examId}}});
        await patient.save();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

class PatientNotFound extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'PatientNotFoundError';
    }
}
eventService.on('examCreated', updatePatientExams);
eventService.on('examDeleted', deleteExamFromPatient);

module.exports = {
    getPatientById,
    deletePatientById,
    getPatientsFiltered,
    getPatientsWithLatestExamDate,
}