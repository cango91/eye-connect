const Funduscopy = require('../models/funduscopy');
const aiService = require('./aiService.js');
const cryptoService = require('./cryptoService');
const eventService = require('./eventService');
const ObjectId = require('mongoose').Types.ObjectId;

const getImageById = async id => {
    const encryptedImage = await Funduscopy.findById(id);
    if (!encryptedImage) throw new Error('Resource not found');
    // If image found, we request a resource lock so the exam containing the image can not be deleted
    // while image is being decrypted. If the Exam can't be locked for any reason, we throw only if the Exam exists
    // If the Exam is already deleted, we'll delete the reference on image and do orphan checking.
    try {
        await eventService.emitEventWithResponse('resourceLockRequest', {
            schema: 'Exam',
            id: encryptedImage.examination._id
        });
        const image = cryptoService.decrypt(encryptedImage);
        eventService.emitEvent('resourceLockRelease', {
            schema: 'Exam',
            id: encryptedImage.examination._id,
        });
        return image;
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
        await eventService.emitEventWithResponse('resourceLockRequest', { schema: 'Exam', id: examId });
        const image = {buffer: cryptoService.encrypt(buffer), contentType};
        const funduscopy = new Funduscopy({
            image,
            examination: new ObjectId(examId)
        });
        await aiService.classifyFunduscopy(funduscopy);
        await funduscopy.save();
        eventService.emitEvent('resourceLockRelease',{
            schema: 'Exam',
            id: examId,
        });
    } catch (e) {
        throw e;
    }
}

const checkOrphaned = (image, { checkExamination = true, checkConsultaion = true }) => {
    const hasExam = checkExamination && !!image.examination;
    const hasCons = checkConsultaion && !!image.consultation;
    return !(hasExam || hasCons);
}

module.exports = {
    getImageById,
}
