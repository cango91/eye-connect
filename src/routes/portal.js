const express = require('express');
const portalCtrl = require('../controllers/portalController');
const router = express.Router();

// No REST for the wicked: Portal/User routes are not RESTful due to 2-step signup process and 2 auth strategies

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
//POST /portal/agreeToPolicy AJAX request to set session variable so the pop-up won't come up again
router.post('/agree-to-policy', portalCtrl.agreeToPolicy);
//POST /portal/rejectPolicy AJAX request to unset session variable. Logs the user out if logged in
router.post('/reject-policy', portalCtrl.rejectPolicy);
//GET /portal/account-status AJAX request to get account status
router.get('/account-status',portalCtrl.getAccountStatus);

module.exports = router;