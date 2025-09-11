import AppliedJob from "../models/AppliedJobs.js";
import Employer from "../models/Employer.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// User applies for a job
// export const applyForJob = async (req, res) => {
//     try {
//         const { jobId, coverLetter } = req.body;
//         const userId = req.user._id;

//         // Check if already applied
//         const alreadyApplied = await AppliedJob.findOne({ user: userId, job: jobId });
//         if (alreadyApplied) {
//             return res.status(400).json({ message: "Already applied to this job", success: false });
//         }

//         const application = await AppliedJob.create({
//             user: userId,
//             job: jobId,
//             coverLetter,
//             status: "applied"
//         });

//         // Add application to user's appliedJobs
//         const userAppliedJobs = await User.findByIdAndUpdate(
//             userId,
//             { $push: { appliedJobs: application._id } },
//             { new: true }
//         ).populate("appliedJobs");


//         console.log(userAppliedJobs);

//         // Add application to employer's appliedJobsbyUser
//         const employer = await Employer.findByIdAndUpdate(
//             job.employer, // yahan se employer lo, req.employer se nahi (kyunki apply user kar raha hai)
//             { $push: { appliedJobsByUser: application._id } },
//             { new: true }
//         ).populate("appliedJobs");


//         console.log(employer);

//         // Add application to job's applicants
//         const job = await Job.findById(jobId);
//         job.applicants.push({ user: userId, appliedAt: new Date(), status: "applied" });
//         await job.save();

//         console.log(job);

//         res.status(201).json({ message: "Applied successfully", success: true, application });
//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

// export const applyForJob = async (req, res) => {
//     try {
//         const { jobId, coverLetter } = req.body;
//         const userId = req.user._id;

//         // Check if job exists
//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({ message: "Job not found", success: false });
//         }

//         // Check if already applied
//         const alreadyApplied = await AppliedJob.findOne({ user: userId, job: jobId });
//         if (alreadyApplied) {
//             return res.status(400).json({ message: "Already applied to this job", success: false });
//         }

//         // Create application
//         const application = await AppliedJob.create({
//             user: userId,
//             job: jobId,
//             employer: job.employer,
//             coverLetter,
//             status: employer.appliedJobsByUser.status // "applied","shortlisted", "rejected", "hired" 
//         });

//         // Add application to job's appliedJobsByUser array
//         await Job.findByIdAndUpdate(
//             jobId,
//             { $push: { appliedJobsByUser: application._id } }
//         );

//         // Update employer -> appliedJobsByUser
//         const employer = await Employer.findByIdAndUpdate(
//             job.employer,
//             { $push: { appliedJobsByUser: application._id } },
//             { new: true }
//         ).populate("appliedJobsByUser");

//         // Update user -> appliedJobs
//         const userAppliedJobs = await User.findByIdAndUpdate(
//             userId,
//             { $push: { appliedJobs: application._id } },
//             { new: true }
//         ).populate("appliedJobs");

//         // Update job -> applicants
//         job.applicants.push({ user: userId, appliedAt: new Date(), status: "applied" });
//         await job.save();

//         res.status(201).json({
//             message: "Applied successfully",
//             success: true,
//             application,
//             user: userAppliedJobs,
//             employer,
//             job,
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

export const applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        const userId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        // Check if already applied
        const alreadyApplied = await AppliedJob.findOne({ user: userId, job: jobId });
        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied to this job", success: false });
        }

        // Create application
        const application = await AppliedJob.create({
            user: userId,
            job: jobId,
            employer: job.employer,
            coverLetter,
            status: "applied" // Always set to "applied" on creation
        });

        // Add application to job's appliedJobsByUser array
        await Job.findByIdAndUpdate(
            jobId,
            { $push: { appliedJobsByUser: application._id } }
        )

        // Update employer -> appliedJobsByUser
        await Employer.findByIdAndUpdate(
            job.employer,
            { $push: { appliedJobsByUser: application._id } }
        );

        // Update user -> appliedJobs
        await User.findByIdAndUpdate(
            userId,
            { $push: { appliedJobs: application._id } }
        );

        // Update job -> applicants
        job.applicants.push({ user: userId, appliedAt: new Date(), status: "applied" });
        await job.save();

        // Fetch updated job to confirm
        const updatedJob = await Job.findById(jobId)
            .populate({
                path: "appliedJobsByUser",
                populate: { path: "user", select: "name email" }
            });


        res.status(201).json({
            message: "Applied successfully",
            success: true,
            application,
            job: updatedJob
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Employer updates application status (accept/reject/hire)
// export const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params;
//         const { status } = req.body; // "applied"," "shortlisted", "rejected", "hired"

//         //  Validate status
//         if (!["applied","shortlisted", "rejected", "hired"].includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid status",
//                 success: false
//             });
//         }

//         //  Find application
//         const application = await AppliedJob.findById(applicationId);
//         if (!application) {
//             return res.status(404).json({ message: "Application not found", success: false });
//         }
//         //  Check if the employer owns the job
//         //  (Assuming req.employer is set by protectEmployer middleware)

//         if (application.job.employer.toString() !== req.employer._id.toString()) {
//             return res.status(403).json({
//                 message: "You can only update applications for your own jobs",
//                 success: false
//             });
//         }

//         // Update status
//         application.status = status;
//         await application.save();

//         res.status(200).json({ message: "Status updated", success: true, application });
//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

// export const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params;
//         const { status } = req.body;

//         // Validate status
//         if (!["applied", "shortlisted", "rejected", "hired"].includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid status",
//                 success: false
//             });
//         }

//         // Find application with job employer
//         const application = await AppliedJob.findById(applicationId).populate("job");
//         if (!application) {
//             return res.status(404).json({ message: "Application not found", success: false });
//         }

//         // Check if logged-in employer owns the job
//         if (application.job.employer.toString() !== req.employer._id.toString()) {
//             return res.status(403).json({
//                 message: "You can only update applications for your own jobs",
//                 success: false
//             });
//         }

//         // Update status
//         application.status = status;
//         await application.save();

//         res.status(200).json({ message: "Status updated", success: true, application });
//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

// export const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params;
//         const { status } = req.body;

//         // ✅ Validate status
//         if (!["applied", "shortlisted", "rejected", "hired"].includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid status",
//                 success: false
//             });
//         }

//         // ✅ Find application with job + employer
//         const application = await AppliedJob.findById(applicationId)
//             .populate("job", "employer title");

//         console.log(application);

//         if (!application) {
//             return res.status(404).json({
//                 message: "Application not found",
//                 success: false
//             });
//         }

//         // ✅ Check if job exists inside application
//         if (!application.job) {
//             return res.status(404).json({
//                 message: "Job not found for this application",
//                 success: false
//             });
//         }

//         // ✅ Check if logged-in employer owns the job
//         if (application.job.employer.toString() !== req.employer._id.toString()) {
//             return res.status(403).json({
//                 message: "You can only update applications for your own jobs",
//                 success: false
//             });
//         }

//         // ✅ Update status
//         application.status = status;
//         await application.save();

//         res.status(200).json({
//             message: "Status updated successfully",
//             success: true,
//             application
//         });
//     } catch (error) {
//         console.error("Update Application Error:", error);
//         res.status(500).json({
//             message: error.message,
//             success: false
//         });
//     }
// };

export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!["applied", "shortlisted", "rejected", "hired"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                success: false
            });
        }

        const application = await AppliedJob.findById(applicationId)
            .populate("job", "employer title");

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        if (!application.job) {
            return res.status(404).json({
                message: "Job not found for this application",
                success: false
            });
        }

        if (application.job.employer.toString() !== req.employer._id.toString()) {
            return res.status(403).json({
                message: "You can only update applications for your own jobs",
                success: false
            });
        }

        // Update status in AppliedJob
        application.status = status;
        await application.save();

        // Update status in Job's applicants array
        await Job.updateOne(
            { _id: application.job._id, "applicants.user": application.user },
            { $set: { "applicants.$.status": status } }
        );

        res.status(200).json({
            message: "Status updated successfully",
            success: true,
            application
        });
    } catch (error) {
        console.error("Update Application Error:", error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


// Get all appliedjobsbyuser for employer
export const getApplicationsForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applications = await AppliedJob.find({ job: jobId }).populate("user").select("-password -appliedjobs")
            .populate("job");

        if (!applications) {
            return res.status(404).json({
                message: "No applications found for this job",
                success: false
            });
        }

        console.log(applications);

        res.status(200).json({
            message: "Applications retrieved successfully",
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const getEmployerApplications = async (req, res) => {
    try {
        // Find jobs posted by this employer
        const jobs = await Job.find({ employer: req.employer._id }).select("_id title");

        const jobIds = jobs.map(job => job._id);

        // Get applications across all those jobs
        const applications = await AppliedJob.find({ job: { $in: jobIds } })
            .populate("user", "name email")
            .populate({
                path: "job",
                populate: {
                    path: "employer",
                    select: "companyName companyDescription website",
                    model: "Employer"
                }
            })

        res.status(200).json({
            success: true,
            applications,
            jobsCount: jobs.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


// Get all applications by user
export const getUserApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        const applications = await AppliedJob.find({ user: userId }).populate("user").select("-password")
            .populate("job");

        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};