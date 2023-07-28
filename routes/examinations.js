const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const examsApi = require('../controllers/api/examinationsController');

// RESTful routes
// GET /examinations -> return all examinations
router.get('/', authorize("READ_ALL_EXAMS"), crudLogger('Read all exams', req => Object.keys(req.query).length ? { ...req.query } : {}), examsApi.getAll);
// GET examinations/:id/ -> return single examination with id
router.get('/:id', authorize("READ_EXAM_BY_ID"), crudLogger('Read single exam', req => ({ id: req.params.id })), examsApi.getOne);

// PUT examinations/:id -> update single examination with id
router.put('/:id', authorize("UPDATE_EXAM_BY_ID"), crudLogger('Update exam', req => ({ id: req.params.id })), examsApi.updateOne);

// DELETE examinations/:id -> delete single examination with id
router.delete('/:id', authorize("DELETE_EXAM"), crudLogger('Delete exam', req => ({ id: req.params.id })), examsApi.delete);

module.exports = router;