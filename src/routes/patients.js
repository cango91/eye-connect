const express = require('express');
const router = express.Router();

// non-RESTful routes

// GET /patients/new -> render new patient
// GET /patients/:id/edit -> render edit patient

// RESTful routes

// GET /patients -> return all patients
// GET /patients/:id -> return one patient
// POST /patients -> create new patient
// PUT /patients/:id -> update patient
// DELETE /patients/:id -> delete patient (NOT ALLOWED in MVP)