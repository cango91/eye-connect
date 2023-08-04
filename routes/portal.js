const express = require('express');
const portalCtrl = require('../controllers/portalController');
const patientsPortalCtrl = require('../controllers/portal/patientsController');
const examsPortalCtrl = require('../controllers/portal/examsController');
const consPortallCtrl = require('../controllers/portal/consController');
const AuthenticateService = require('../services/authenticationService');
const authenticate = new AuthenticateService();
const ensureProfileComplete = require('../middlewares/ensureProfileComplete');
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const router = express.Router();

// GET /portal -> if logged-in redirect to /portal/home
// if not logged in redirect to /portal/login
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.validationStatus === 'Incomplete') {
            res.redirect('/portal/signup');
        } else {
            res.redirect('/portal/home');
        }
    } else {
        res.redirect('/portal/login');
    }
});

//GET /portal/login/oauth/google
router.get('/login/oauth/google', portalCtrl.login);
//GET /portal/login/oauth/google/callback
router.get('/login/oauth/google/callback', portalCtrl.oAuthCallback);
//GET /portal/logout
router.get('/logout', portalCtrl.logout);
//GET /portal/login display login page
router.get('/login', portalCtrl.showLogIn);
//GET /portal/forgot-password
router.get('/forgot-password', portalCtrl.showForgotPassword);
//GET /portal/signup show signup page for local-strategy or completion
router.get('/signup', portalCtrl.showSignUp);
//POST /portal/login to login the user
router.post('/login', portalCtrl.login);
//POST /portal/signup to signup a new user
router.post('/signup', portalCtrl.signUp);
//POST /portal/signup/complete complete profile
router.post('/signup/complete', portalCtrl.completeProfile);
//POST /portal/agreeToPolicy set session variable so the pop-up won't come up again
router.post('/agree-to-policy', portalCtrl.agreeToPolicy);
//POST /portal/rejectPolicy unset session variable. Logs the user out if logged in
router.post('/reject-policy', portalCtrl.rejectPolicy);
//GET /portal/account-status get account status
router.get('/account-status', portalCtrl.getAccountStatus);

// GET portal/patients/new -> render new patient
router.get('/patients/new/', authenticate.authenticate, authorize('CREATE_PATIENT'), crudLogger('View new patient form', req => ({...req.query})), patientsPortalCtrl.new);

// GET /portal/patients to view all patients for Field HCP
router.get('/patients', authenticate.authenticate, ensureProfileComplete, authorize('READ_ALL_PATIENTS'), crudLogger('View Patients', req => ({ ...req.query })), patientsPortalCtrl.index);

// GET /portal/patients/:id to view patient details
router.get('/patients/:id', authenticate.authenticate, ensureProfileComplete, authorize('READ_PATIENT_BY_ID'), crudLogger('View patient', req => ({ patientId: req.params.id })), patientsPortalCtrl.details);

// GET patients/:id/examinations/new -> render new examination for patient with id
router.get('/patients/:id/exams/new', authenticate.authenticate, ensureProfileComplete, authorize('ADD_EXAM'), crudLogger('Create New Exam', req => ({ patientId: req.params.id })), examsPortalCtrl.new);

// GET examinations/:id/edit -> update examination with id
router.get('/exams/:id', authenticate.authenticate, ensureProfileComplete, authorize('VIEW_EXAM_DETAILS'), crudLogger('View exam details', req => ({ examId: req.params.id })), examsPortalCtrl.details);

// GET /portal/exams to view owned or all examinations for Field HCP
router.get('/exams', authenticate.authenticate, ensureProfileComplete, authorize('READ_ALL_EXAMS'), crudLogger('View Exams', req => ({ ...req.query })), examsPortalCtrl.index);

// GET /portal/exams/:id/consultation/new -> create new consultation for exam with id
router.get('/exams/:id/consultation/new',authenticate.authenticate, ensureProfileComplete, authorize('VIEW_NEW_CONS_PAGE'),crudLogger('View create new cons page',req=>({examId: req.params.id})),consPortallCtrl.new);

// GET /portal/exams/:id/consultation -> get consultation for exam with :id
router.get('/exams/:id/consultation',authenticate.authenticate, ensureProfileComplete, authorize('VIEW_CONSULTATION'),crudLogger('View consultation',req=>({examId: req.params.id})),consPortallCtrl.details)

// GET /portal/consultations/:id -> get single consultation with :id
router.get('/consultations/:id',authenticate.authenticate, ensureProfileComplete, authorize('VIEW_CONSULTATION'),crudLogger('View consultation',req=>({consId: req.params.id})),consPortallCtrl.getOne)

module.exports = router;