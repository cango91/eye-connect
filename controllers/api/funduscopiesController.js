const fundusService = require('../../services/funduscopiesService.js');
const eventService = require('../../services/eventService.js');
const processing = new Map();

const getSingleFunduscopy = async (req, res, next) => {
    try {
        const response = await fundusService.getImageById(req.params.id);
        res.status(200).json({data:response});
    } catch (error) {
        console.error(error); 
        next(error);
    }
}

const create = async (req,res,next) =>{
    try {
        const key = `${req.body.examId}_${req.file.mimetype}_${req.file.buffer.toString('base64')}`;
        
        if(processing.has(key)){
            return res.status(400).json({error: "Already processing this image for the exam"});
        }

        processing.set(key, true);

        const processedObject = {
            examId: req.body.examId,
            buffer: req.file.buffer,
            contentType: req.file.mimetype,
        }

        const fundus = await fundusService.create(processedObject);

        processing.delete(key);

        res.status(200).json({data: {_id: fundus._id, classificationResult: fundus.classificationResult}});
    } catch (error) {
        processing.delete(key);
        console.error(error);
        next(error);
    }
}

module.exports = {
    getSingleFunduscopy,
    create,
}