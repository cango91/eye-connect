const Exam = require('../../models/examination');
const examsService = require('../../services/examsService');
const eventService = require('../../services/eventService');
const Types = require('mongoose').Types;

let examsCountCache = null;
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);

const getAllFiltered = async (req, res, next) => {
    try {
        let { sortBy, order, limit, page, filter, filterValue } = req.query;
        limit = limit ? Math.max(0,parseInt(limit)) : MAX_LIMIT;
        limit = Math.min(MAX_LIMIT, limit);
        sortBy = sortBy ? sortBy : 'updatedAt';
        order = order ? order : 'descending';
        const sort = { [sortBy]: order === 'ascending' ? 1 : -1 };
        page = page ? parseInt(page) : 1;
        page = Math.max(page, 1);
        const skip = (page - 1) * limit;
        const collation = { locale: 'en', strength: 2 };
        let query = {}
        if(filter && filter.endsWith('_id') && filterValue) filterValue = new Types.ObjectId(filterValue);
        if (filter && filterValue) query = { [filter]: filterValue };
        const results = await examsService.getExamsFiltered(query, sort, collation, skip, limit);
        const pageCount = Math.ceil(results.totalCount / limit);
        res.status(200).json({
            data: [...results.exams],
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
        return await getAllFiltered(req,res,next);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getOne = async (req, res, next) => {
    try {
        const exam = await examsService.findById(req.params.id);
        res.status(200).json({ data: exam });
    } catch (err) {
        console.error(err);
        if (err.name === 'ExamNotFound')
            res.status(404).json({ error: err })
        next(err);
    }
}

const deleteOne = async (req, res, next) => {
    try {
        const ensureOwnership = req.user.role !== 'MedicalDirector';
        await examsService.deleteExamById(req.params.id, ensureOwnership ? req.user.id : false);
        res.status(204).json({ status: 204 });
        examsCountCache = null;
    } catch (err) {
        console.error(err);
        if (err.name === 'ExamNotFound')
            res.status(404).json({ error: err });
        next(err);
    }
}

const updateOne = async (req, res, next) => {
    try {
        const ensureOwnership = req.user.role !== 'MedicalDirector' && req.user.id;
        const exam = await examsService.updateExamNotes(req.params.id, res.body, ensureOwnership);
        res.status(200).json({ data: exam });
    } catch (err) {
        if (err.name === 'ExamNotFound')
            res.status(404).json({ error: err });
        if (err.name === 'NotAllowed')
            res.status(403).json({ error: err });
        next(err);
    }
}
eventService.on('examCreated', async () => examsCountCache = null);
eventService.on('examDeleted', async () => examsCountCache = null);
module.exports = {
    getAll,
    getOne,
    delete: deleteOne,
    updateOne,
}