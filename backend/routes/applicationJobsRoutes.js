import express from "express";
import {
  applyForJob,
  updateApplicationStatus,
  getApplicationsForJob,
  getUserApplications,
  getEmployerApplications,
} from "../controllers/applicationJobs.js";
import { protectEmployer, protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User applies for a job
router.post("/apply", protectUser, applyForJob);

// Employer updates application status
router.put("/status/:applicationId", protectEmployer, updateApplicationStatus);

// Employer gets all applications
router.get("/", protectEmployer, getEmployerApplications);

// Employer gets all applications for a job
router.get("/job/:jobId", protectEmployer, getApplicationsForJob);

// User gets all their applications
router.get("/my", protectUser, getUserApplications);

export default router;