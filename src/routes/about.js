const express = require('express');
const router = express.Router();
const aboutCtrl = require('../controllers/aboutController');

// GET /about
router.get('/',aboutCtrl);

module.exports = router;