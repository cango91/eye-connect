const Exam = require('../../models/examination');

let examsCountCache = null;
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);

const getAll = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length) return await getAllFiltered(req, res, next);
        if (!examsCountCache) {
            examsCountCache = await Exam.countDocuments();
        }
        if (examsCountCache > MAX_LIMIT) {
            req.query.limit = MAX_LIMIT;
            return await getAllFiltered(req, res, next);
        }
        const patients = await Exam.find({});
        res.status(200).json({ data: [...patients], page: 1, pageCount: 1, limit: MAX_LIMIT });
    } catch (err) {
        console.error(err);
        next(err);
    }
}


module.exports = {
    getAll,

}