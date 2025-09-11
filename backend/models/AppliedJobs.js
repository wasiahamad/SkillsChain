// backend/models/AppliedJob.js
import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer"
    },
    coverLetter: {
        type: String
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected", "hired"],
        default: "applied",
    },
}, { timestamps: true });

const AppliedJob = mongoose.model("AppliedJob", appliedJobSchema);
export default AppliedJob;

