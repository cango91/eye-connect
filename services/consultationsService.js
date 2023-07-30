const Cons = require('../models/consultation');
const eventService = require('./eventService');
const examsService = require('./examsService');
const imageService = require('./funduscopiesService');
const cryptoService = require('./cryptoService');
const userService = require('./usersService');
const ObjectId = require('mongoose').Types.ObjectId;



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


const createConsultation = async consData => {
    try {
        if (!consData.consultant || !consData.examination) throw new Error('Missing required info');
        if (!consData.notes) consData.notes = '';
        const cons = await Cons.create(encryptConsNotes(consData));
        return cons._id;
    } catch (error) {
        console.error(error);
        throw error;
    }
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
        const cons = await Cons.find({ 'examination': new ObjectId(eventData.examId) });
        if (cons) {
            const consultant = await userService.getUserById(cons.consultant);
            await userService.notifyUser(consultant._id, { action: 'ExamRemoved', consultation: new ObjectId(cons._id) });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

eventService.on('examDeleted', onExamDeleted);
eventService.on('imageCreated',onImageCreated);

module.exports = {
    createConsultation,
    getConsultationById,
}