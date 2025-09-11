// // Placeholder for controllers/jobController.js

// import Job from "../models/Job.js";
// import User from "../models/User.js";
// import AppliedJob from "../models/AppliedJobs.js";
// import Employer from "../models/Employer.js";

// // Post a job only employers can post jobs
// // const postJobs = async (req, res) => {
// //   try {
// //     const employer = await Employer.findById(req.user._id);

// //     if (!employer) {
// //       return res.status(403).json({ 
// //         message: "Only employers can post jobs" ,
// //         success: false
// //       });
// //     }

// //     const {
// //       title,
// //       description,
// //       location,
// //       employmentType,
// //       experienceLevel,
// //       skillsRequired,
// //       salaryRange,
// //       applicationDeadline,
// //     } = req.body;

// //     const newJob = new Job({
// //       employer: req.user._id,
// //       title,
// //       description,
// //       location,
// //       employmentType,
// //       experienceLevel,
// //       skillsRequired,
// //       salaryRange,
// //       applicationDeadline,
// //       status: "Active",
// //     });

// //     await newJob.save();
// //     res.status(201).json(newJob);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// const postJobs = async (req, res) => {
//   try {
//     const employer = await Employer.findById(req.employer._id);

//     if (!employer) {
//       return res.status(403).json({
//         message: "Only employers can post jobs",
//         success: false,
//       });
//     }

//     const {
//       title,
//       description,
//       location,
//       employmentType,
//       experienceLevel,
//       skillsRequired,
//       salaryRange,
//       applicationDeadline,
//     } = req.body;

//     const newJob = new Job({
//       employer: req.employer._id, // ✅ yahan req.employer use karna h
//       title,
//       description,
//       location,
//       employmentType,
//       experienceLevel,
//       skillsRequired,
//       salaryRange,
//       applicationDeadline,
//       status: "Active",
//     });

//     await newJob.save();
//     res.status(201).json(newJob);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // update a job by id only (only the employer who posted the job can update it)
// const updateJob = async (req, res) => {
//   try {
//     const employer = await Employer.findById(req.employer._id);

//     if (!employer) {
//       return res.status(403).json({
//         message: "Only employers can update jobs",
//         success: false
//       });
//     }

//     const job = await Job.findById(req.params.id);

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // ✅ check owner
//     if (job.employer.toString() !== req.employer._id.toString()) {
//       return res.status(403).json({
//         message: "You can only update your own jobs",
//         success: false
//       });
//     }

//     const updates = req.body;

//     Object.keys(updates).forEach((key) => {
//       job[key] = updates[key];
//     });

//     await job.save();

//     res.status(200).json({
//       message: "Job updated successfully",
//       success: true,
//       job,
//     })

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // delete a job by id only (only the employer who posted the job can delete it)

// // Get all jobs
// const getJobs = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search,
//       location,
//       employmentType,
//       experienceLevel,
//     } = req.query;

//     const query = { status: "Active" };

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//         { skillsRequired: { $in: [new RegExp(search, "i")] } },
//       ];
//     }

//     if (location) {
//       query.location = { $regex: location, $options: "i" };
//     }

//     if (employmentType) {
//       query.employmentType = employmentType;
//     }

//     if (experienceLevel) {
//       query.experienceLevel = experienceLevel;
//     }

//     const jobs = await Job.find(query)
//       .populate("employer", "companyName companyDescription website")
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });

//     const total = await Job.countDocuments(query);

//     res.json({
//       jobs,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get single job
// const getJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id).populate(
//       "employer",
//       "companyName companyDescription website"
//     );

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     res.json(job);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const applyForJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const { coverLetter } = req.body;

//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // Check if already applied
//     const existing = await AppliedJob.findOne({
//       user: req.user._id,
//       job: jobId
//     });

//     if (existing) {
//       return res.status(400).json({ message: "You already applied for this job" });
//     }

//     // ✅ Create AppliedJob record
//     const appliedJob = await AppliedJob.create({
//       user: req.user._id,
//       job: jobId,
//       coverLetter,
//       status: "Pending"
//     });

//     // ✅ Push AppliedJob ref into User
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: { appliedJobs: appliedJob._id }
//     });

//     // ✅ Push applicant into Job model
//     job.applicants.push({
//       user: req.user._id,
//       appliedAt: new Date(),
//       status: "Pending"
//     });
//     await job.save();

//     res.json({ success: true, appliedJob });
//   } catch (error) {
//     console.error("Apply job error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };




// export { postJobs, updateJob, getJobs, getJob, applyForJob };


import Job from "../models/Job.js";
import Employer from "../models/Employer.js";
import User from "../models/User.js";

// CREATE Job (Only Employer)
const createJob = async (req, res) => {
  try {
    const employer = await Employer.findById(req.employer._id);

    if (!employer) {
      return res.status(403).json({
        message: "Only employers can create jobs",
        success: false,
      });
    }

    // create job
    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      skillsRequired: req.body.skillsRequired,
      location: req.body.location,
      employmentType: req.body.employmentType,
      experienceLevel: req.body.experienceLevel,
      salaryRange: req.body.salaryRange,
      applicationDeadline: req.body.applicationDeadline,
      status: "Active",
      employer: req.employer._id,
    });

    // Add job to employer's postedJobs
    const employerPostedJobs = await Employer.findByIdAndUpdate(
      req.employer._id,
      { $push: { postedJobs: job._id } },
      { new: true }
    ).populate("postedJobs");

    if (!employerPostedJobs) {
      return res.status(404).json({
        message: "Employer not found",
        success: false,
      });
    }

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all jobs
// const getJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ status: "Active" })
//       .populate("employer", "companyName companyDescription website")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       message: "Jobs fetched successfully",
//       success: true,
//       jobs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };

// READ single job
// const getJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id).populate(
//       "employer",
//       "companyName companyDescription website"
//     )
//     .populate("appliedJobsByUser");

//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found",
//         success: false,
//       });
//     }

//     res.status(200).json({
//       message: "Job fetched successfully",
//       success: true,
//       job,
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       success: false
//     });
//   }
// };

const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employer", "companyName companyDescription website industry")
      .populate("appliedJobsByUser")
      .populate("applicants.user", "name email"); // ✅ Include user details

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      employmentType,
      experienceLevel,
    } = req.query;

    let query = { status: "Active" };

    // 🔑 KEY CHANGE: Filter by employer if authenticated
    if (req.employer) {
      query.employer = req.employer._id;
    }

    // Apply search filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (location) query.location = { $regex: location, $options: "i" };
    if (employmentType) query.employmentType = employmentType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const jobs = await Job.find(query)
      .populate("employer", "companyName companyDescription website")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
      message: req.employer ? "Your jobs" : "All jobs",
      success: true,
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// UPDATE Job (Only Owner Employer)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);


    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    // Check if the employer owns the job
    if (job.employer.toString() !== req.employer._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own jobs",
        success: false,
      });
    }

    //  Update job details 
    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.location = req.body.location || job.location;
    job.salaryRange = req.body.salaryRange || job.salaryRange
    job.experience = req.body.experience || job.experience;
    job.type = req.body.type || job.type;
    job.status = req.body.status || job.status;

    await job.save();

    res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job,

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Job (Only Owner Employer)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    //  Check if the employer owns the job
    if (job.employer.toString() !== req.employer._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own jobs",
        success: false,
      });
    }

    // Delete job from employer's postedJobs
    await Employer.findByIdAndUpdate(
      req.employer._id,
      { $pull: { postedJobs: job._id } },
      { new: true }
    );

    await job.deleteOne();

    res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

export { createJob, getJobs, getJob, updateJob, deleteJob };
