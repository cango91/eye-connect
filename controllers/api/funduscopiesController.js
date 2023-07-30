const fundusService = require('../../services/funduscopiesService.js');
const eventService = require('../../services/eventService.js');

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
        const fundus = await fundusService.create({
            examId: req.body.examId,
            buffer: req.file.buffer,
            contentType: req.file.mimetype,
        });
        res.status(200).json({data: fundus._id});
    } catch (error) {
        console.error(error);;
        next(error);
    }
}

const getFuncuscopyAsThumbnail = async (req,res,next) =>{
    try {
        const dims = [req.query?.width || 256, req.query?.height || 256];
        const response = await fundusService.getThumbnailById(req.params.id, dims);
        res.status(200).json({data:response});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    getSingleFunduscopy,
    create,
    getFuncuscopyAsThumbnail,
}