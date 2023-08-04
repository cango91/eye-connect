const ObjectId = require('mongoose').Types.ObjectId;
const consService = require('../../services/consultationsService');
const MAX_LIMIT = process.env.MAX_LIMIT;

const getAllFiltered = async (req, res, next) => {
    try {
        let { limit, order, sortBy, page, filter, filterValue } = req.query;
        limit = limit ? Math.max(0, parseInt(limit)) : MAX_LIMIT;
        limit = Math.min(MAX_LIMIT, limit);
        sortBy = sortBy ? sortBy : 'updatedAt';
        order = order ? order : 'descending';
        const sort = { [sortBy]: order === 'ascending' ? 1 : -1 };
        page = page ? parseInt(page) : 1;
        page = Math.max(page, 1);
        page = Math.min(page, MAX_LIMIT);
        const skip = (page - 1) * limit;
        const collation = { locale: 'en', strength: 2 };
        let query = {}
        if (filter && filter.endsWith('_id') && filterValue) filterValue = new ObjectId(filterValue);
        if (typeof filterValue === 'string' && filterValue.startsWith('_id')) filterValue = new ObjectId(filterValue.substring(3));
        if (filter && filterValue) query = { [filter]: filterValue };
        if (filterValue === 'true') filterValue = true;
        if (filterValue === 'false') filterValue = false;

        const results = await consService.getConsultationsFiltered(query, sort, collation, skip, limit);
        const pageCount = Math.ceil(results.totalCount / limit);
        res.status(200).json({
            data: [...results.consultations],
            page,
            limit,
            pageCount
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getOne = async (req, res, next) => {
    try {
        const cons = await consService.findById(req.params.id);
        res.status(200).json({ data: cons });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const createConsultationForExam = async (req, res, next) => {
    try {
        const cons = await consService.createConsultationForExam({
            consultant: req.user.id,
            notes: req.body.notes || '',
        }, req.body.examId);
        res.status(200).json({ data: cons });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const updateConsultation = async (req, res, next) => {
    try {
        const cons = await consService.updateConsultation({ userId: req.user.id, id: req.params.id, ...req.body });
        res.status(200).json({ data: cons });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const deleteOne = async (req, res, next) => {
    try {
        await consService.delete(req.params.id, req.user.id);
        res.status(200).json({ status: 204 });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    getAllFiltered,
    getOne,
    createConsultationForExam,
    updateConsultation,
    delete: deleteOne

}