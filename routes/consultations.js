const express = require('express');
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const consApi = require('../controllers/api/consultationsController');
const router = express.Router();

// non-RESTful routes

// RESTful routes
// GET /consultations -> return all consultations. filter by query params
router.get('/',authorize('GET_CONSULTATIONS'),crudLogger('Get all consultations',req=>({...req.query})),consApi.getAllFiltered);

// POST portal/api/consultations -> create new consultation
router.post('/',authorize('CREATE_CONSULTATION'),crudLogger('Get all consultations',req=>({examId: req.body.examId})),consApi.createConsultationForExam);


module.exports = router;