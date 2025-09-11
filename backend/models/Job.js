import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    skillsRequired: [{
        type: String,
        trim: true
    }],
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },

    // ✅ Applied jobs (reference to AppliedJob schema)
    appliedJobsByUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppliedJob'
    }],

    // ✅ Applicants array (for quick access)
    applicants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected", "hired"],
            default: "applied"
        }
    }],

    location: { type: String },
    salaryRange: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        default: 'Full-time'
    },
    experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior', 'Executive'],
        default: 'Mid'
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Draft'],
        default: 'Active'
    },
    applicationDeadline: {
        type: Date,
        default: Date.now // Default to current date if not provided
    }
}, { timestamps: true });

jobSchema.virtual('applicationsCount').get(function () {
    return this.applicants?.length || 0;
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
