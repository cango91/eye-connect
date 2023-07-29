const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const funduscopyApi = require('../controllers/api/funduscopiesController');

// get  api/funduscopies get specific image
router.get('/:id', authorize('GET_FUNDUS_IMAGE'), crudLogger('Uploaded fundus image',req=>({id: req.params.id})),funduscopyApi.getSingleFunduscopy);

// post api/funduscioies

// delete api/funduscopies

// put api/funduscopies


module.exports = router;