const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    consultation: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Consultation'
    },
    action: {
        type: String,
        enum: ['ConsRemoved', 'ConsUpdated', 'ConsCreated','ImageAdded','ImageRemoved','ExamNotesUpdated','ExamRemoved'],
    },
    status:{
        type: String,
        enum: ['New', 'Acknowledged'],
        required: true,
        default: 'New'
    },
    href: String,
    message: String,
},
    {
        timestamps: true,
    });

const userSchema = new Schema({
    displayName: {
        type: String,
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
    },
    role: {
        type: String,
        enum: ['FieldHCP', 'SpecialistHCP','MedicalDirector'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    institution: {
        type: String,
        required: true,
    },
    additionalInfo: {
        type: String,
    },
    validationStatus: {
        type: String,
        enum: ['Incomplete', 'PendingValidation', 'Validated', 'ValidationFailed', 'ValidationRevoked'],
        required: true,
        default: 'Incomplete',
    },
    notifications: [notificationSchema]
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);