const express = require('express');
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const consApi = require('../controllers/api/consultationsController');
const router = express.Router();

// non-RESTful routes

// RESTful routes
// GET /consultations -> return all consultations. filter by query params
router.get('/',authorize('GET_CONSULTATIONS'),crudLogger('Get all consultations',req=>({...req.query})),consApi.getAllFiltered);

// GET /consultations/:id -> return single consultation with id
// POST /examinations/:id/consultations -> create new consultation for exam with id

module.exports = router;