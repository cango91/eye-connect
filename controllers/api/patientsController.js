const Patient = require('../../models/patient');
const patientsService = require('../../services/patientsService');

let patientCountCache = null;
const MAX_LIMIT = parseInt(process.env.MAX_LIMIT);

const getAllFiltered = async (req, res, next) => {
    try {
        let { sortBy, order, limit, page } = req.query;
        limit = limit ? parseInt(limit) : MAX_LIMIT;
        limit = Math.min(MAX_LIMIT, limit);
        const sort = { [sortBy]: order === 'ascending' ? 1 : -1 };
        page = page ? parseInt(page) : 1;
        const skip = (page - 1) * limit;
        page = Math.max(page, 1);
        const patients = await Patient.find().sort(sort).collation({ locale: 'en', strength: 2 }).limit(limit).skip(skip);
        if (!patientCountCache) {
            patientCountCache = await Patient.countDocuments();
        }
        const maxPages = Math.ceil(patientCountCache / limit);
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
        if(err.name==='PatientNotFoundError')
            res.status(404).json({error: 'Not found'});
        else
            next(err);
    }
}

const deleteOne = async (req, res, next) => {
    try {
        await Patient.deleteOne({ _id: req.params.id });
        patientCountCache = null;
        res.status(200).json({ data: req.params.id });
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
        res.status(200).json({ data: patient._id });
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
        res.status(200).json({ data: patient });
    } catch (err) {
        console.error(err);
        next(err);
    }
}


const searchByName = async (req, res, next) => {
    try {
        const { name, limit = 10, sort = 'ascending' } = req.query;
        if (!name) return res.status(400).json({ error: 'Search term missing' });
        const patients = await Patient.find({
            name: { $regex: name, $options: 'i' }
        }).limit(limit).sort({ name: sort === 'ascending' ? 1 : -1 });
        return res.status(200).json({data: patients});
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
}