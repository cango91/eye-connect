const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const crudLogger = require('../middlewares/crudLogger');
const funduscopyApi = require('../controllers/api/funduscopiesController');
const multer = require('multer');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/^image\/.*/)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
}

// get  api/funduscopies/:id get specific image
router.get('/:id', authorize('GET_FUNDUS_IMAGE'), crudLogger('Retrieved fundus image', req => ({ id: req.params.id })), funduscopyApi.getSingleFunduscopy);

// get api/funduscopies/:id/thumbnail?width&height to get a smaller image
router.get('/:id/thumbnail',authorize('GET_FUNDUS_IMAGE'), crudLogger('Retrieved fundus image', req => ({ id: req.params.id })), funduscopyApi.getFuncuscopyAsThumbnail);

// get api/funduscopies/:id/consultation -> return the consultationId


// post api/funduscioies
router.post('/', authorize('UPLOAD_FUNDUS_IMAGE'), multer(multerOptions).single('image'), crudLogger('Uploaded fundus image', req => ({ examId: req.body.examId })), funduscopyApi.create);

// delete api/funduscopies

// put api/funduscopies ?


module.exports = router;