const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const examsApi = require('../controllers/api/examinationsController');

// non-RESTful routes
// GET patients/:id/examinations/new -> render new examination for patient with id
// GET examinations/:id/edit -> update examination with id


// RESTful routes
// GET /examinations -> return all examinations
router.get('/', authorize("READ_ALL_EXAMS"),crudLogger('Read all exams',req=> Object.keys(req.query).length ? {...req.query} : {} ),  examsApi.getAll);
// GET patients/:id/examinations -> return all examinations of patient => patientController needs to use
// GET examinations/:id/ -> return single examination with id
router.get('/:id', authorize("READ_EXAM_BY_ID"), crudLogger('Read single exam', req => ({id:req.params.id})),examsApi.getOne);
// POST patients/:id/examinations -> create new examination for patient with id
// PUT examinations/:id -> update single examination with id
// DELETE examinations/:id -> delete single examination with id

module.exports = router;