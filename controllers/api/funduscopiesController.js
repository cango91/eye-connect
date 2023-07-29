const fundusService = require('../../services/funduscopiesService.js');
const eventService = require('../../services/eventService.js');

const getSingleFunduscopy = async (req, res, next) => {
    try {
        if(!req.body.examId) throw new Error('Missing exam information');
        const response = await fundusService.getImage(req.params.id);
        res.status(200).json({data:response});
    } catch (error) {
        console.error(error);
        
        next(error);
    }
}

module.exports = {
    getSingleFunduscopy,
}