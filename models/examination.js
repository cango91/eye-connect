const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examinationSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    examiner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patient: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    notes: {
        type: String
    },
    hasConsultation: {
        type: Boolean,
        default: false,
    },
    consultation: {
        type: Schema.Types.ObjectId,
        ref: 'Consultation'
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Funduscopy'
    }]
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Examination', examinationSchema);