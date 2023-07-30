const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    date: {
        type: Date
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    ancestors: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

const consultationSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    consultant: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    retinopathyDiagnosis: {
        type:String,
        enum: ['NoApparentDR', 'MildNPDR', 'ModerateNPDR', 'SevereNPDR', 'PDR']
    },
    notes: {
        type: String,
        required: true,
    },
    examination: {
        type: Schema.Types.ObjectId,
        ref: 'Examination'
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Funduscopy',
    }],
    comments: [commentSchema]
});

module.exports = mongoose.model('Consultation',consultationSchema);

