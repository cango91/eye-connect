const express = require('express');
const portalCtrl = require('../controllers/portalController');
const router = express.Router();

// GET /portal -> if logged-in redirect to /portal/home
// if not logged in redirect to /portal/login
router.get('/',(req,res)=>{
    if(req.user){
        res.redirect('/portal/home');
    }else{
        res.redirect('/portal/login');
    }
});

//GET /portal/login display login page
router.get('/login',portalCtrl.showLogIn);

//GET /portal/forgot-password
router.get('/forgot-password',portalCtrl.showForgotPassword);

//GET /portal/signup show signup page for local-strategy
router.get('/signup',portalCtrl.showSignUp);

//POST /portal/agreeToPolicy AJAX request to set session variable so the pop-up won't come up again
router.post('/agree-to-policy',portalCtrl.agreeToPolicy);

//POST /portal/rejectPolicy AJAX request to unset session variable. Logs the user out
router.post('/reject-policy',portalCtrl.rejectPolicy);

module.exports = router;