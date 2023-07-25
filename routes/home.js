const express = require('express');
const router = express.Router();
const AuthenticateService = require('../services/authenticationService');
const authenticate = new AuthenticateService().authenticate;
const ensureComplete = require('../middlewares/ensureProfileComplete');
const homeController = require('../controllers/homeController');

router.get('/', authenticate, ensureComplete, homeController.home);

module.exports = router;