const Patient = require('../../models/patient');

const getAllFiltered = async (req, res, next) => {
    try {
        let {sortBy, sort, limit, page} = req.query;
        limit = limit ? parseInt(limit) : 0;
        sort = { [sortBy]: sort==='ascending' ? 1 : -1};
        page = page ? parseInt(page) : 1;
        const skip = (page - 1) * limit;
        const patients = await Patient.find().sort(sort).collation({locale:'en', strength:2}).limit(limit).skip(skip);
        res.status(200).json([...patients]);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getAll = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length) return await getAllFiltered(req, res, next);
        const patients = await Patient.find({});
        res.status(200).json([...patients]);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const getById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        res.status(200).json({ patient });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const deleteOne = async (req, res, next) => {
    try {
        await Patient.deleteOne({ _id: req.params.id });
        res.status(200).json({ id: req.params.id });
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
        res.status(200).json({ id: patient._id });
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
        res.status(200).json({ patient });
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
        return res.status(200).json(patients);
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