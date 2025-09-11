import express from "express";
import {
  createSkill,
  getUserSkills,
  updateSkill,
  deleteSkill,
  endorseSkill
} from "../controllers/skillController.js";
import { protectUser } from "../middlewares/authMiddleware.js"; // for authentication

const router = express.Router();

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private
router.post("/", protectUser, createSkill);

// @route   GET /api/skills
// @desc    Get all skills of logged-in user
// @access  Private
router.get("/", protectUser, getUserSkills);

// @route   PUT /api/skills/:skillId
// @desc    Update a skill
// @access  Private
router.put("/:skillId", protectUser, updateSkill);

// @route   DELETE /api/skills/:skillId
// @desc    Delete a skill
// @access  Private
router.delete("/:skillId", protectUser, deleteSkill);

// POST /api/skills/:id/endorse
router.post("/:id/endorse", protectUser, endorseSkill);

export default router;
