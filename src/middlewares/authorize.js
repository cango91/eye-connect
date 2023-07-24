const authorizationDictionary = {
    READ_ALL_PATIENTS: ['FieldHCP','SpecialistHCP','MedicalDirector'],
    READ_PATIENT_BY_ID: ['FieldHCP','SpecialistHCP','MedicalDirector'],
    CREATE_PATIENT: ['FieldHCP','MedicalDirector'],
    UPDATE_PATIENT: ['FieldHCP','MedicalDirector'],
    DELETE_PATIENT: ['MedicalDirector'],
    SEARCH_PATIENT_BY_NAME: ['FieldHCP','SpecialistHCP','MedicalDirector'],
}

const authorize = action => (req,res,next) =>{
    if(req.user.validationStatus === 'Validated' && authorizationDictionary[action].includes(req.user.role)){
        next();
    }else{
        res.status(403).json({error: "Unauthorized"});
    }
}

module.exports = authorize;