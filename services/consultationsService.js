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
        { $unset: ['examiner.email', 'examiner.password', 'examiner.validationStatus', 'examiner.notifications', 'examiner.additionalInfo', 'examiner.googleId'] },
        { 
            $lookup: {
                from: 'users',
                localField: 'consultant',
                foreignField: '_id',
                as: 'consultant'
            },
        },
        {$unwind: {path: '$consultant'}},
        { $unset: ['consultant.email', 'consultant.password', 'consultant.validationStatus', 'consultant.notifications', 'consultant.additionalInfo', 'consultant.googleId'] },
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


const createConsultationForExam = async (consData, examId) => {
    try {
        if (!consData.consultant || !examId) throw new Error('Missing required info');
        if (!consData.notes) consData.notes = '';
        const existingCons = await Cons.findOne({examination: new ObjectId(examId)});
        if(existingCons) throw new Error('Exam already has consultation');
        consData.examination = await examsService.findById(examId);
        if (consData.examination.images.length) {
            consData.images = consData.examination.images.map(e => e);
        } else {
            consData.images = [];
        }
        encryptConsNotes(consData);
        const cons = await Cons.create(consData);
        eventService.emitEvent('consultationCreated', { consId: cons._id, examId: cons.examination });
        return cons._id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateConsultation = async consultationData => {
    let {notes, retinopathyDiagnosis, id, userId} = consultationData;
    if(!notes || !retinopathyDiagnosis || !['NoApparentDR', 'MildNPDR', 'ModerateNPDR', 'SevereNPDR', 'PDR'].includes(retinopathyDiagnosis)) throw new Error('Incomplete Consultation Data');
    try {
        const cons = await Cons.findById(id);
        if(!cons) throw new Error('Consultation resource not found!');
        if(userId){
            if(userId !== cons.consultant.toString()) throw new Error('Not authorized');
        }
        cons.notes = notes;
        cons.retinopathyDiagnosis = retinopathyDiagnosis;
        encryptConsNotes(cons);
        await cons.save();
        decryptConsNotes(cons);
        eventService.emitEvent('consultationUpdated', { consId: cons._id, examId: cons.examination, consNotes: cons.notes, retinopathyDiagnosis: cons.retinopathyDiagnosis });
        console.log(await cons.populate('examination'));
        await userService.notifyUser((await cons.populate('examination')).examination.examiner,{
            consultation: cons._id,
            action: 'ConsUpdated',
            href: '/portal/exams/' + cons.examination._id + '/consultation'
        });
        return cons;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteCons = async (id,userId) =>{
    try {
        const cons = await Cons.findById(id);
        if(!cons) throw new Error('Consultation notfound!');
        if(userId){
            if(cons.consultant.toString()!==userId) throw new Error('Not Authorized');
        }
        eventService.emitEvent('consultationDeleted',{consId: cons._id, examId: cons.examination});
        userService.notifyUser((await cons.populate('examination')).examination.examiner,{
            consultation: cons._id,
            action: 'ConsRemoved',
            href: '/portal/exams/' + cons.examination._id
        });
        await cons.deleteOne();
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
    updateConsultation,
    delete:deleteCons,
}