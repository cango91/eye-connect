const Patient = require('../models/patient');

const getPatientById = async patientId => {
    try {
        const patient = await Patient.findById(patientId);
        if(!patient) throw new PatientNotFound('Patient not found!');
        return patient;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

class PatientNotFound extends Error {
    constructor(msg){
        super(msg);
        this.name = 'PatientNotFoundError';
    }
}

module.exports = {
    getPatientById,
}