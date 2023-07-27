const express = require('express');
const portalCtrl = require('../controllers/portalController');
const patientsPortalCtrl = require('../controllers/portal/patientsController');
const examsPortalCtrl = require('../controllers/portal/examsController');
const AuthenticateService = require('../services/authenticationService');
const authenticate  = new AuthenticateService();
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
router.get('/account-status',portalCtrl.getAccountStatus);

// GET /portal/patients to view all patients for Field HCP
router.get('/patients', authenticate.authenticate, ensureProfileComplete, authorize('READ_ALL_PATIENTS'),crudLogger('View Patients',req=>({...req.query})),patientsPortalCtrl);
// GET /portal/exams to view owned (by default) examinations for Field HCP
router.get('/exams',authenticate.authenticate, ensureProfileComplete, authorize('READ_ALL_EXAMS'),crudLogger('View Exams',req=>({...req.query})),examsPortalCtrl);

module.exports = router;