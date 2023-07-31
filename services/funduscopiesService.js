const Funduscopy = require('../models/funduscopy');
const aiService = require('./aiService.js');
const cryptoService = require('./cryptoService');
const eventService = require('./eventService');
const consService = require('./consultationsService');
const cvInit = require('../infra/opencvInit');
let tf;
try {
    tf = require('@tensorflow/tfjs-node');
} catch (error) {
    tf = require('@tensorflow/tfjs');
}
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

const resizeImage = async (imageData, dims, mimetype) => {
    await cvInit();
    dims = dims || [512, 512];
    const array = tf.node.decodeImage(new Uint8Array(imageData), 3);
    const matOrg = cv.matFromArray(array.shape[0], array.shape[1], cv.CV_8UC3, array.flatten().arraySync());
    const mat = new cv.Mat();
    cv.resize(matOrg, mat, new cv.Size(dims[0], dims[1]), 0, 0, cv.INTER_AREA);
    matOrg.delete();
    const tensor = tf.tensor(mat.data, [mat.rows, mat.cols, 3]);
    const result = tf.node.encodePng(tensor);
    mat.delete();
    tensor.dispose();
    array.dispose();
    return result;
}

const getThumbnailById = async (id, thumbnailDimensions = [256, 256]) => {
    try {
        const encryptedImage = await Funduscopy.findById(id);
        if (!encryptedImage) throw new Error('Resource not found');
        const image = encryptedImage.image;

        image.data = cryptoService.decrypt(image.data);

        const dims = thumbnailDimensions.map(dim => Number(parseInt(dim)));

        const newData = Buffer.from(await resizeImage(image.data, dims))

        const thumbnail = {
            id: encryptedImage._id,
            image: {
                data: newData,
                contentType: image.contentType,
            },
            examination: encryptedImage.examination,
        };
        return thumbnail;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const create = async (data) => {
    try {
        const { buffer, contentType, examId } = data;
        if (!buffer || !contentType || !examId) throw new Error('Missing necessary information');
        //await eventService.emitEventWithResponse('resourceLockRequest', { schema: 'Exam', id: examId });
        const image = { contentType, data: cryptoService.encrypt(buffer) };

        const funduscopy = new Funduscopy({
            image,
            examination: new ObjectId(examId),
        });
        const result = await aiService.classifyFunduscopy(funduscopy);
        funduscopy.$set('classificationResult.value', result.vaule);
        funduscopy.$set('classificationResult.result', result.result);
        // await funduscopy.save();
        // eventService.emitEvent('resourceLockRelease',{
        //     schema: 'Exam',
        //     id: examId,
        // });
        await funduscopy.save();
        eventService.emitEvent('imageCreated', { imageId: funduscopy._id, examId: examId });
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
        if (!funduscopies.length) throw new Error('Funduscopy resource not found');
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
                        resultString = 'Severe non-proliferative Diabetic Retinoathy'
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

const onConsDeleted = async ({examId, consId}) =>{

}

eventService.on('examDeleted', onExamDeleted);
eventService.on('consultationCreated', onConsCreated);
eventService.on('consultationDeleted',onConsDeleted);

module.exports = {
    getImageById,
    create,
    getThumbnailById,
}
