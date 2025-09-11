import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employerSchema = new mongoose.Schema({
    employerName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    companyName : {
        type: String,
        required: true,
        trim: true
    },
    postedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    appliedJobsByUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppliedJob'
    }],
    companyDescription: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

employerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

employerSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Employer = mongoose.model('Employer', employerSchema);
export default Employer;