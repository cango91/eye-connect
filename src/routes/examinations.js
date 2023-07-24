const express = require('express');
const router = express.Router();

// non-RESTful routes
// GET patients/:id/examinations/new -> render new examination for patient with id
// GET examinations/:id/edit -> update examination with id


// RESTful routes
// GET /examinations -> return all examinations created by current user
// GET patients/:id/examinations -> return all examinations of patient
// GET examinations/:id/ -> return single examination with id
// POST patients/:id/examinations -> create new examination for patient with id
// PUT examinations/:id -> update single examination with id
// DELETE examinations/:id -> delete single examination with id

module.exports = router;