// Placeholder for controllers/employerController.js

import jwt from 'jsonwebtoken';
import Employer from '../models/Employer.js';
import Job from '../models/Job.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register employer
const registerEmployer = async (req, res) => {
  try {
    const { employerName, email, password, companyName } = req.body;

    const employerExists = await Employer.findOne({ email });
    if (employerExists) {
      return res.status(400).json({
        message: 'Employer already exists',
        success: false
      });
    }

    const employer = await Employer.create({
      employerName,
      email,
      password,
      companyName,
    });

    if (employer) {
      res.status(201).json({
        message: 'Employer registered successfully',
        success: true,
        employer: {
          _id: employer._id,
          employerName: employer.employerName,
          companyName: employer.companyName,
          email: employer.email,
          postedJobs: employer.postedJobs,
          appiedJobsByUser: employer.appliedJobsByUser,
          companyDescription: employer.companyDescription,
          website: employer.website
        },
        token: generateToken(employer._id),
      });
    } else {
      res.status(400).json({
        message: 'Invalid employer data',
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

// Login employer
const loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employer = await Employer.findOne({ email });
    if (employer && (await employer.correctPassword(password, employer.password))) {
      res.json({
        message: 'Login successful',
        success: true,
        user: {
          _id: employer._id,
          employerName: employer.employerName,
          companyName: employer.companyName,
          email: employer.email,
          postedJobs: employer.postedJobs,
          appiedJobsByUser: employer.appliedJobsByUser,
          companyDescription: employer.companyDescription,
          website: employer.website,
        },
        token: generateToken(employer._id),
      });

    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employer profile
const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.employer._id).select('-password')
    .populate('postedJobs')
    .populate('appliedJobsByUser');

    if (!employer) {
      return res.status(404).json({
        message: 'Employer not found',
        success: false
      });
    }

    res.status(200).json({
      message: 'Employer profile fetched successfully',
      success: true,
      employer
    })

    console.log(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update employer profile
const updateEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.employer._id).select('-password');

    if (employer) {
      employer.companyName = req.body.companyName || employer.companyName;
      employer.employerName = req.body.employerName || employer.employerName;
      employer.companyDescription = req.body.companyDescription || employer.companyDescription;
      employer.website = req.body.website || employer.website;

      const updatedEmployer = await employer.save();

      res.status(200).json({
        message: 'Employer profile updated successfully',
        success: true,
        employer: updatedEmployer
      })
    } else {
      res.status(404).json({ 
        message: 'Employer not found' ,
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: error.message ,
      success: false
    });
  }
};

// 

export {
  registerEmployer,
  loginEmployer,
  getEmployerProfile,
  updateEmployerProfile
};
