const Schema = require('mongoose').Schema;

const notificationSchema = new Schema({
    consultation: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Consultation'
    },
    action: {
        type: String,
        enum: ['Removed', 'Updated', 'Created'],
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    oAuthToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ['FieldHCP', 'SpecialistHCP'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    insitution: {
        type: String,
        required: true,
    },
    additionalInfo: {
        type: String,
    },
    validationStatus: {
        type: String,
        enum: ['PendingValidation', 'Validated', 'ValidationFailed', 'ValidationRevoked'],
        required: true,
        default: 'PendingValidation',
    },
    notifications: [notificationSchema]

});

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
        enum: ['male', 'female'],
    },
    exams: [{
        type: Schema.Types.ObjectId,
        ref: 'Examination'
    }]
});

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
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Funduscopy'
    }]
});

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
        ref: 'Examination'
    },
    consultation: {
        type: Schema.Types.ObjectId,
        ref: 'Consultation'
    }
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