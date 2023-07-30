const Cons = require('../models/consultation');
const eventService = require('./eventService');
const examsService = require('./examsService');
const imageService = require('./funduscopiesService');
const cryptoService = require('./cryptoService');
const userService = require('./usersService');
const ObjectId = require('mongoose').Types.ObjectId;


const getConsultationsFiltered = async (filterBefore, sort, collation, skip, limit, filterAfter = {}) => {
    const pipeline = [
        { $match: filterBefore },
        {
            $lookup: {
                from: 'examinations',
                localField: 'examination',
                foreignField: '_id',
                as: 'exam'
            },
        },
        { $unwind: { path: '$exam' } },
        { $unset: ['exam.images', 'exam.hasConsultation'] },
        {
            $lookup: {
                from: 'patients',
                localField: 'exam.patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        { $unwind: { path: '$patient' } },
        {
            $lookup: {
                from: 'users',
                localField: 'exam.examiner',
                foreignField: '_id',
                as: 'examiner',
            }
        },
        { $unwind: { path: '$examiner' } },
        { $unset: ['examiner.email', 'examiner.password', 'examiner.validationStatus', 'examiner.notifications', 'examiner.additionalInfo'] },
    ];
    if (Object.keys(filterAfter).length) {
        pipeline.push({ $match: filterAfter });
    }
    pipeline.push({ $sort: sort });
    const totalQuery = await Cons.aggregate(pipeline).collation(collation);
    const totalCount = totalQuery.length;
    const paginatedQuery = totalQuery.slice(skip, skip + limit);
    paginatedQuery.forEach(q => {
        decryptConsNotes(q);
        decryptConsNotes(q.exam);
    });

    return {
        totalCount: totalCount,
        consultations: paginatedQuery
    };
}


const getConsultationById = async consId => {
    try {
        const cons = await Cons.findById(consId);
        if (!cons) throw new Error('Consultation resource not found');
        return decryptConsNotes(cons);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const createConsultationForExam = async (consData,examId) => {
    try {
        if (!consData.consultant || !consData.examination) throw new Error('Missing required info');
        if (!consData.notes) consData.notes = '';
        encryptConsNotes(consData);
        const images = await examsService.findById(consData.examination).images;
        consData.images = images.map(img => img instanceof ObjectId ? img : new ObjectId(img));
        const cons = await Cons.create(consData);
        eventService.emitEvent('consultationCreated', { consId: cons._id, examId: cons.examination });
        return cons._id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateConsNotes = async notes =>{

}

const encryptConsNotes = cons => {
    if (cons.notes) {
        cons.notes = cryptoService.encryptText(cons.notes);
    }
    return cons;
}

const decryptConsNotes = cons => {
    if (cons.notes) {
        cons.notes = cryptoService.decryptText(cons.notes);
    }
    return cons;
}

const onImageCreated = async eventData => {
    try {
        const cons = await Cons.findOne({ 'examination': eventData.examId });
        if (!cons) return;
        await cons.updateOne({ $push: { 'images': new ObjectId(eventData.imageId) } });
        await userService.notifyUser(cons.consultant, { action: 'ImageAdded', consultation: new ObjectId(cons._id) })
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const onExamDeleted = async eventData => {
    try {
        const cons = await Cons.findOne({ 'examination': new ObjectId(eventData.examId) });
        if (cons) {
            const consultant = await userService.getUserById(cons.consultant);
            await userService.notifyUser(consultant, { action: 'ExamRemoved', consultation: new ObjectId(cons._id) });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

eventService.on('examDeleted', onExamDeleted);
eventService.on('imageCreated', onImageCreated);

module.exports = {
    createConsultationForExam,
    getConsultationById,
    getConsultationsFiltered,
    updateConsNotes,
}