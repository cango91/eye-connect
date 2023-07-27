const express = require('express');
const router = express.Router();
const crudLogger = require('../middlewares/crudLogger');
const patientsApi = require('../controllers/api/patientsController');
const authorize = require('../middlewares/authorize');

// GET /patients -> return all patients
router.get('/', authorize('READ_ALL_PATIENTS'), crudLogger('Read all patients',req=> Object.keys(req.query).length ? {...req.query} : {} ), patientsApi.getAll);

// GET /patients/s?name=&limit=&sort= patient search where name begins with name=, limited by limit=, sorted by sort=ascending or descending otherwise
router.get('/s', authorize('SEARCH_PATIENT_BY_NAME'), crudLogger('Search patient by name', req => ({name: req.query.name})), patientsApi.searchByName);

// GET patients/:id/examinations -> return all examinations of patient
router.get('/:id/examinations', authorize('GET_EXAMS_OF_PATIENT'), crudLogger('Read all exams of patient', req=>({patient_id: req.params.id})), patientsApi.getExamsOfPatient);

// GET /patients/:id -> return one patient
router.get('/:id', authorize('READ_PATIENT_BY_ID'), crudLogger('Read patient by id', req => ({ id: req.params.id })), patientsApi.getById);
// POST /patients -> create new patient
router.post('/', authorize('CREATE_PATIENT'), crudLogger('Create new patient', req => ({ ...req.body })), patientsApi.create);
// PUT /patients/:id -> update patient
router.put('/:id', authorize('UPDATE_PATIENT'), crudLogger('Update patient', req => {
    const result = {};
    for (const key in req.body) {
        if (req.body[key] !== '') result[key] = req.body[key];
    }
    return { id: req.params.id, ...result };
}), patientsApi.updateOne);
// DELETE /patients/:id -> delete patient (NOT ALLOWED in MVP... or IS IT??)
router.delete('/:id', authorize('DELETE_PATIENT'), crudLogger('Delete patient', req => ({ id: req.params.id })), patientsApi.delete);

// POST /patients/:id/examinations => create new exam for patient
router.post('/:id/examinations', authorize('ADD_EXAM'), crudLogger('Add examination for patient', req=>{
    const result = {};
    for(const key in req.body){
        if(req.body[key] !== '') result[key] = req.body[key];
    }
    return {patient_id: req.params.id, ...result};
}),patientsApi.createExamForPatient);
// GET /patients/new -> render new patient
// GET /patients/:id/edit -> render edit patient



module.exports = router;