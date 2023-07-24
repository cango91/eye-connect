const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    exams: [{
        type: Schema.Types.ObjectId,
        ref: 'Examination'
    }]
});

module.exports = mongoose.model('Patient',patientSchema);