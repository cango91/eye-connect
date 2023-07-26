const Patient = require('../models/patient');
const eventService = require('./eventService');

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

const deletePatientById = async id =>{
    try {
        const patient = await Patient.findById(id);
        if(patient){
            await eventService.emitEvent('patientDeleted', id); //examsService.onPatientDeleted(id);
        }else{
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
        console.log(err);
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
    deletePatientById,
    getPatientsFiltered,
}