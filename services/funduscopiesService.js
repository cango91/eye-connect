const Funduscopy = require('../models/funduscopy');
const aiService = require('./aiService.js');
const cryptoService = require('./cryptoService');
const eventService = require('./eventService');
const consService = require('./consultationsService');
const examsService = require('./examsService');
const crudLogger = require('../middlewares/crudLogger');
const ObjectId = require('mongoose').Types.ObjectId;

const getImageById = async id => {
    const encryptedImage = await Funduscopy.findById(id);
    if (!encryptedImage) throw new Error('Resource not found');
    // If image found, we request a resource lock so the exam containing the image can not be deleted
    // while image is being decrypted. If the Exam can't be locked for any reason, we throw only if the Exam exists
    // If the Exam is already deleted, we'll delete the reference on image and do orphan checking.
    try {
        // await eventService.emitEventWithResponse('resourceLockRequest', {
        //     schema: 'Exam',
        //     id: encryptedImage.examination._id
        // });

        const image = encryptedImage.image;
        image.data = cryptoService.decrypt(image.data);

        // eventService.emitEvent('resourceLockRelease', {
        //     schema: 'Exam',
        //     id: encryptedImage.examination._id,
        // });
        encryptedImage.set('image', image);
        return encryptedImage;
    } catch (e) {
        // Why fail? If resource not found, we should check if image is orphaned (no cons, no exam = delete the image):
        if ((e instanceof Error && e.name === "NotFoundError") || (typeof e === 'string' && e.match(/^.*is not found|was not found|couldn\'t find|can\'t find|could not find|can not find|no longer available|is deleted|was deleted\i/))) {
            if (checkOrphaned(image, { checkExamination: false })) {
                await encryptedImage.deleteOne();
                throw new Error("Resource no longer available");
            } else {
                // we should update the reference to exam as null, but keep the image since it has a consultation associated.
                encryptedImage.updateOne({ $set: { 'examination': null } });
            }
        } else {
            throw e;
        }
    };
}

const create = async (data) => {
    try {
        const { buffer, contentType, examId } = data;
        if (!buffer || !contentType || !examId) throw new Error('Missing necessary information');

        const classificationResult = await aiService.classifyImage(buffer, contentType);
        const image = { contentType, data: cryptoService.encrypt(buffer) };

        const exam = await examsService.findById(examId);

        const funduscopy = new Funduscopy({
            image,
            examination: exam._id,
            patient: exam.patient,
            consultation: exam.consultation,
        });

        funduscopy.$set('classificationResult.value', classificationResult.value);
        funduscopy.$set('classificationResult.result', classificationResult.result);

        await funduscopy.save();
        eventService.emitEvent('imageCreated', { imageId: funduscopy._id, examId: examId, classificationResult });
        return funduscopy;
    } catch (e) {
        throw e;
    }
}

const checkOrphaned = (image, { checkExamination = true, checkConsultaion = true }) => {
    const hasExam = checkExamination && !!image.examination;
    const hasCons = checkConsultaion && !!image.consultation;
    return !(hasExam || hasCons);
}

const onExamDeleted = async (eventData) => {
    const { examId } = eventData;
    try {
        const images = await Funduscopy.find({ examination: new ObjectId(examId) });
        if (images.length) {
            for (let i = 0; i < images.length; i++) {
                if (checkOrphaned(images[i], { checkExamination: false })) {
                    // no eventEmit since orphaned... Who'd listen to it :'(
                    crudLogger('Funduscopy deleted', req => ({ funduscopyId: images[i]._id, reason: 'automatic removal: funduscopy orphaned' }))({ user: {} }, {}, () => ({}));
                    await images[i].deleteOne();
                } else {
                    images[i].examination = null;
                    await images[i].save();
                }
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const onConsCreated = async ({ examId, consId }) => {
    try {
        const funduscopies = await Funduscopy.find({ 'examination': new ObjectId(examId) });
        //if (!funduscopies || !funduscopies.length) throw new Error('Funduscopy resource not found');
        if (!funduscopies || !funduscopies.length) return;
        for (let i = 0; i < funduscopies.length; i++) {
            let funduscopy = funduscopies[i];

            if (funduscopy.consultation) throw new Error('Image already has consultation');
            funduscopy.consultation = new ObjectId(consId);
            const cons = await consService.getConsultationById(consId);
            if (!cons) throw new Error('Consultation not found');
            const diagnosis = cons.retinopathyDiagnosis;
            if (diagnosis) {
                let resultString;
                switch (diagnosis) {
                    case ('NoApparentDR'):
                        resultString = 'No Apparent Diabetic Retinopathy';
                        break;
                    case ('MildNPDR'):
                        resultString = 'Mild non-proliferative Diabetic Retinopathy'
                        break;
                    case ('ModerateNPDR'):
                        resultString = 'Moderate non-proliferative Diabetic Retinopathy'
                        break;
                    case ('SevereNPDR'):
                        resultString = 'Severe non-proliferative Diabetic Retinopathy'
                        break;
                    case ('PDR'):
                        resultString = 'Proliferative Diabetic Retinopathy'
                        break;
                }
                if (resultString) {
                    funduscopy.verifiedResult = resultString;
                    funduscopy.verifiedBy = cons.consultant;
                    funduscopy.verified = true;
                } else {
                    funduscopy.verifiedResult = '';
                    funduscopy.verifiedBy = null;
                    funduscopy.verified = false;
                }
            }
            await funduscopy.save();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const onConsUpdated = async ({ examId, consId }) => {
    try {
        const funduscopies = await Funduscopy.find({ 'examination': new ObjectId(examId) });
        if (funduscopies && funduscopies.length) {
            for (let i = 0; i < funduscopies.length; i++) {
                let funduscopy = funduscopies[i];
                const cons = await consService.getConsultationById(consId);
                if (!cons) throw new Error('Consultation not found');
                const diagnosis = cons.retinopathyDiagnosis;
                if (diagnosis) {
                    let resultString;
                    switch (diagnosis) {
                        case ('NoApparentDR'):
                            resultString = 'No Apparent Diabetic Retinopathy';
                            break;
                        case ('MildNPDR'):
                            resultString = 'Mild non-proliferative Diabetic Retinopathy'
                            break;
                        case ('ModerateNPDR'):
                            resultString = 'Moderate non-proliferative Diabetic Retinopathy'
                            break;
                        case ('SevereNPDR'):
                            resultString = 'Severe non-proliferative Diabetic Retinopathy'
                            break;
                        case ('PDR'):
                            resultString = 'Proliferative Diabetic Retinopathy'
                            break;
                    }
                    if (resultString) {
                        funduscopy.verifiedResult = resultString;
                        funduscopy.verifiedBy = cons.consultant;
                        funduscopy.verified = true;
                    } else {
                        funduscopy.verifiedResult = '';
                        funduscopy.verifiedBy = null;
                        funduscopy.verified = false;
                    }
                }
                await funduscopy.save();
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const onConsDeleted = async ({ examId, consId }) => {
    try {
        const funduscopies = await Funduscopy.find({ consultation: new ObjectId(consId) });
        if (funduscopies && funduscopies.length) {
            for (let i = 0; i < funduscopies.length; i++) {
                if (checkOrphaned(funduscopies[i], { checkConsultaion: false })) {
                    crudLogger('Funduscopy deleted', req => ({ funduscopyId: funduscopies[i]._id, reason: 'automatic removal: funduscopy orphaned' }))({ user: {} }, {}, () => ({}));
                    await funduscopies[i].deleteOne();
                } else {
                    funduscopies[i].consultation = null;
                    await funduscopies[i].save();
                }
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const onPatientDeleted = async ({ patientId }) => {
    try {
        const images = await Funduscopy.find({ patient: new ObjectId(patientId) });
        while (images.length) {
            const image = images.pop();
            crudLogger('Funduscopy deleted', req => ({ funduscopyId: image._id, reason: 'automatic removal: patient deleted' }))({ user: {} }, {}, () => ({}));
            await image.deleteOne();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

eventService.on('examDeleted', onExamDeleted);
eventService.on('consultationCreated', onConsCreated);
eventService.on('consultationDeleted', onConsDeleted);
eventService.on('consultationUpdated', onConsUpdated);
eventService.on('patientDeleted', onPatientDeleted);

module.exports = {
    getImageById,
    create,
}
