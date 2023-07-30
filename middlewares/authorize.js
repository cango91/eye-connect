const authorizationDictionary = {
    READ_ALL_PATIENTS: ['FieldHCP','SpecialistHCP','MedicalDirector'],
    READ_PATIENT_BY_ID: ['FieldHCP','SpecialistHCP','MedicalDirector'],
    CREATE_PATIENT: ['FieldHCP','MedicalDirector'],
    UPDATE_PATIENT: ['FieldHCP','MedicalDirector'],
    DELETE_PATIENT: ['MedicalDirector','FieldHCP'],
    SEARCH_PATIENT_BY_NAME: ['FieldHCP','SpecialistHCP','MedicalDirector'],
    READ_ALL_EXAMS: ['FieldHCP','MedicalDirector','SpecialistHCP'],
    READ_EXAM_BY_ID: ['FieldHCP','MedicalDirector','SpecialistHCP'],
    ADD_EXAM: ['FieldHCP'],
    READ_ALL_EXAMS_AWAITING_CONSULTATION: ['MedicalDirector','SpecialistHCP'],
    DELETE_EXAM: ['FieldHCP','MedicalDirector'],
    GET_EXAMS_OF_PATIENT: ['FieldHCP','MedicalDirector','SpecialistHCP'],
    UPDATE_EXAM_BY_ID: ['FieldHCP','MedicalDirector'],
    VIEW_EXAM_DETAILS: ['FieldHCP','MedicalDirector','SpecialistHCP'],
    UPLOAD_FUNDUS_IMAGE: ['FieldHCP'],
    GET_FUNDUS_IMAGE: ['FieldHCP','SpecialistHCP','MedicalDirector'],
    GET_CONSULTATIONS: ['SpecialistHCP','MedicalDirector'],
}

const authorize = action => (req,res,next) =>{
    if(req.user.validationStatus === 'Validated' && authorizationDictionary[action].includes(req.user.role)){
        next();
    }else{
        res.status(403).json({error: "Unauthorized"});
    }
}

module.exports = authorize;