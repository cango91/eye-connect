const consService = require('../../services/consultationsService');

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
        page = Math.min(page, 1);
        const skip = (page - 1) * limit;
        const collation = { locale: 'en', strength: 2 };
        let query = {}
        if (filter && filter.endsWith('_id') && filterValue) filterValue = new Types.ObjectId(filterValue);
        if (filterValue === 'true') filterValue = true;
        if (filterValue === 'false') filterValue = false;
        if (filter && filterValue) query = { [filter]: filterValue };
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
            consultantId: req.user.id,
            notes: req.body.notes || '',
        }, req.params.id);
        res.status(200).json({ data: cons._id });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    getAllFiltered,
    getOne,
    createConsultationForExam,
}