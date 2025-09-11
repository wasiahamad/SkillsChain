import express from "express";
import {
    createJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";
import { protectEmployer } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectEmployer, createJob);
router.get("/", getJobs);
router.get("/:id", getJob);
router.put("/:id", protectEmployer, updateJob);
router.delete("/:id", protectEmployer, deleteJob);

export default router;
