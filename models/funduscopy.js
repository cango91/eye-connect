const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const classificationResultSchema = new Schema({
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    result: {
        type: String,
        default: 'Must be verified!'
    }
});


const funduscopySchema = new Schema({
    image: {
        data: Buffer,
        contentType: String,
    },
    classificationResult: { type: classificationResultSchema },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    verifiedResult: {
        type: String
    },
    examination: {
        type: Schema.Types.ObjectId,
        ref: 'Examination',
        required: true,
    },
    consultation: {
        type: Schema.Types.ObjectId,
        ref: 'Consultation'
    }
});

module.exports = mongoose.model('Funduscopy', funduscopySchema);