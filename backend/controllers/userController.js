// Placeholder for controllers/userController.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Job from '../models/Job.js';
import AppliedJob from "../models/AppliedJobs.js";
import bcrypt from 'bcryptjs';
import { matchJobsToCandidate } from '../utils/aiService.js';


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
const registerUser = async (req, res) => {
  try {
  const { name, email, password, ethAddress } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
        success: false
      });
    }

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      skills: [],
      certificates: [],
      resume: '',
      appliedJobs: [],
      ethAddress: ethAddress || ''
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          skills: user.skills,
          certificates: user.certificates,
          resume: user.resume,
          appliedJobs: user.appliedJobs,
          ethAddress: user.ethAddress
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: 'Invalid user data',
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// Login user
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (user && (await user.correctPassword(password, user.password))) {
//       // Inside loginUser
//       res.json({
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//         },
//         token: generateToken(user._id),
//       });

//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. User find karo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not Register with this email",
        success: false
      });
    }

    // 2. Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false
      });
    }

    // 3. Token generate karo
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful with this email",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// Get user profile details by id from token 
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("skills")
      .populate("certificates")
      .populate({
        path: "appliedJobs", // pehle AppliedJob populate hoga
        populate: {
          path: "job",       // AppliedJob ke andar job populate hoga
          populate: {
            path: "employer",  // Job ke andar employer populate hoga
            select: "companyName companyDescription website"
          }
        }
      });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }

    res.status(200).json({
      user,
      message: "User profile fetched successfully",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

  // ✅ Update basic fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.resume) user.resume = req.body.resume;
  if (req.body.ethAddress) user.ethAddress = req.body.ethAddress;

    // ✅ Handle password update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // ✅ Just assign skill ObjectIds (not creating new skills here)
    if (req.body.skills && req.body.skills.length > 0) {
      user.skills = req.body.skills; // Array of ObjectIds
    }

    const updatedUser = await user.save();

    // ✅ populate skills before sending response
    await updatedUser.populate("skills");

    res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


// get all users - employer use case
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: 'Users fetched successfully',
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

//  

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers
};