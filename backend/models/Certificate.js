import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    issuedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    blockchainHash: {
        type: String,
        unique: true
    },
    fileUrl: {
        type: String
    },
    verificationUrl: {
        type: String
    },
    description: {
        type: String
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    expirationDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;