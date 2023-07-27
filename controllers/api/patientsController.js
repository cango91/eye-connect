const Patient = require('../../models/patient');
const patientsService = require('../../services/patientsService');
const examsService = require('../../services/examsService');

let patientCountCache = null;
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);

const getAllFiltered = async (req, res, next) => {
    try {
        let { sortBy, order, limit, page, filter, filterValue, includeLatestExamDate } = req.query;
        limit = limit ? parseInt(limit) : MAX_LIMIT;
        limit = Math.min(MAX_LIMIT, limit);
        const sort = { [sortBy]: order === 'ascending' ? 1 : -1 };
        page = page ? parseInt(page) : 1;
        const skip = (page - 1) * limit;
        page = Math.max(page, 1);
        let query = {};
        if (filter && filterValue) {
            query = { [filter]: filterValue };
        }
        const collation = { locale: 'en', strength: 2 };
        let patients, totalCount;
        if(includeLatestExamDate || sortBy==='numExams' || sortBy === 'latestExamDate'){
            ({patients, totalCount}  = await patientsService.getPatientsWithLatestExamDate(query,sort,collation,skip,limit));
        }else{
            // TODO refactor getPatientsFiltered to return total count from service
            patients = await patientsService.getPatientsFiltered(query, sort,collation,skip,limit);
            totalCount = await Patient.countDocuments({query})
        }           
        const maxPages = Math.ceil(totalCount / limit);
        res.status(200).json({
            data: [...patients],
            page,
            limit,
            pageCount: maxPages,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getAll = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length) return await getAllFiltered(req, res, next);
        if (!patientCountCache) {
            patientCountCache = await Patient.countDocuments();
        }
        if (patientCountCache > MAX_LIMIT) {
            req.query.limit = MAX_LIMIT;
            return await getAllFiltered(req, res, next);
        }
        const patients = await Patient.find({});
        res.status(200).json({ data: [...patients], page: 1, pageCount: 1, limit: MAX_LIMIT });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getById = async (req, res, next) => {
    try {
        const patient = await patientsService.getPatientById(req.params.id);
        res.status(200).json({ data: patient });
    } catch (err) {
        console.error(err);
        if (err.name === 'PatientNotFoundError')
            res.status(404).json({ error: 'Not found' });
        else
            next(err);
    }
}

const deleteOne = async (req, res, next) => {
    try {
        await patientsService.deletePatientById(req.params.id);
        patientCountCache = null;
        res.status(204).json({ status: 204 });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        // Remove empty properties so that defaults will be applied
        for (let key in req.body) {
            if (req.body[key] === '') delete req.body[key];
        }
        const patient = await Patient.create(req.body);
        patientCountCache = null;
        res.status(201).json({ data: { ...patient } });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const updateOne = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) throw new Error('Patient not found');
        for (let key in req.body) {
            if (req.body[key] !== '') {
                patient[key] = req.body[key];
            }
        }
        await patient.save();
        res.status(200).json({ data: { ...patient } });
    } catch (err) {
        console.error(err);
        next(err);
    }
}


const searchByName = async (req, res, next) => {
    try {
        let { name, limit, sort } = req.query;
        limit = limit || 10;
        limit = Math.min(limit,MAX_LIMIT);
        sort = sort || 'ascending';
        if (!name) return res.status(400).json({ error: 'Search term missing' });
        const patients = await Patient.find({
            name: { $regex: name, $options: 'i' }
        }).limit(limit).sort({ name: sort === 'ascending' ? 1 : -1 });
        return res.status(200).json({ data: patients });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const createExamForPatient = async (req, res, next) => {
    try {
        const exam = await examsService.createExamForPatient(req.params.id, req.user.id, req.body);
        res.status(201).json({ data: { ...exam } });
    } catch (err) {
        console.error(err);
        if (err.name === 'PatientNotFoundError') {
            res.status(404).json({ error: err });
        }
        next(err);
    }
}

const getExamsOfPatient = async (req, res, next) => {
    try {
        const exams = await examsService.getExamsOfPatient(req.params.id);
        res.status(200).json({ data: exams });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    create,
    delete: deleteOne,
    updateOne,
    getById,
    getAll,
    searchByName,
    createExamForPatient,
    getExamsOfPatient,
}