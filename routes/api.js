const express = require('express');
const router = express.Router();
const AuthenticateService = require('../services/authenticationService');
const authenticate = new AuthenticateService();
const ensureProfileComplete = require('../middlewares/ensureProfileComplete');
const patientsRoute = require('./patients');
const examsRoute = require('./examinations');
const fundusRoute = require('./funduscopies');
const consRoute = require('./consultations');


router.use('/', authenticate.authenticate, ensureProfileComplete);
router.use('/patients', patientsRoute);
router.use('/examinations', examsRoute);
router.use('/consultations', consRoute);
router.use('/funduscopies', fundusRoute);

module.exports = router;