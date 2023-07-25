const Exam = require('../models/examination');

const getExamsOfPatient = async patientId =>{
    try {
        const exams = await Exam.find({patient: patientId}).sort({updatedAt: -1});
        return exams;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createExamForPatient = async (patientId, examData) =>{
    try {
        
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    getExamsOfPatient,
    createExamForPatient,
}