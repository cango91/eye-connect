const express = require('express');
const router = express.Router();

// non-RESTful routes

// RESTful routes
// GET /consultations -> return all consultations. filter by query params
// GET /consultations/:id -> return single consultation with id
// POST /examinations/:id/consultations -> create new consultation for exam with id
