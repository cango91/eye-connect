const Exam = require('../../models/examination');

let examsCountCache = null;
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);

const getAllFiltered = async (req,res,next)=>{
    try {
        let { sortBy, order, limit, page } = req.query;
        limit = limit ? parseInt(limit) : MAX_LIMIT;
        limit = Math.min(MAX_LIMIT, limit);
        sortBy = sortBy ? sortBy : 'updatedAt';
        order = order ? order : 'descending';
        const sort = { [sortBy]: order === 'ascending' ? 1 : -1 };
        page = page ? parseInt(page) : 1;
        const skip = (page - 1) * limit;
        page = Math.max(page, 1);
        const exams = await Exam.find().sort(sort).collation({ locale: 'en', strength: 2 }).limit(limit).skip(skip);
        if(!examsCountCache){
            examsCountCache = await Exam.countDocuments();
        }
        const pageCount = Math.ceil(examsCountCache / limit);
        res.status(200).json({
            data: [...exams],
            page,
            limit,
            pageCount
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

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

const getOne = async (req,res,next)=>{
    try {
        const exam = await Exam.findById(req.params.id);
        if(exam){
            res.status(200).json({data: exam});
        } 
    } catch (err) {
        console.error(err);
        next(err);
    }
}


module.exports = {
    getAll,
    getOne,
    
}