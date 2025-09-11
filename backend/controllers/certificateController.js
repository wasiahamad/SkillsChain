import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { generateCertificateText } from '../utils/aiService.js';
import generateCertificatePDF  from '../utils/pdfGenerator.js';
import { issueBlockchainCertificate, verifyBlockchainCertificate } from '../utils/blockchainService.js';
import { sendCertificateEmail } from '../utils/emailService.js';


// Issue a new certificate
const issueCertificate = async (req, res) => {
  try {
    const { userId, skillId, title, expirationDate } = req.body;
    
    // Validate user, employer, and skill
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Check if skill belongs to user
    if (skill.owner.toString() !== userId) {
      return res.status(400).json({ message: 'Skill does not belong to this user' });
    }
    
    // Generate certificate text using AI
    const description = await generateCertificateText(
      skill.name, 
      user.name, 
      skill.level
    );
    
    // Create certificate record
    const certificate = await Certificate.create({
      title: title || `${skill.name} Certificate`,
      issuedTo: userId,
      issuedBy: req.employer._id,
      skill: skillId,
      description,
      expirationDate
    });
    
    // Generate certificate hash for blockchain
    const certHash = `${user._id}-${req.employer._id}-${skill._id}-${Date.now()}`;
    
    // Issue certificate on blockchain
    const blockchainResult = await issueBlockchainCertificate(
      user._id.toString(),
      certHash
    );
    
    // Update certificate with blockchain hash
    certificate.blockchainHash = certHash;
    await certificate.save();
    
    // Generate PDF certificate
    const pdfFileName = `certificate-${certificate._id}.pdf`;
    const pdfPath = path.join(__dirname, '../certificates', pdfFileName);
    
    await generateCertificatePDF({
      userName: user.name,
      skillName: skill.name,
      skillLevel: skill.level,
      description,
      issueDate: certificate.issueDate,
      issuerName: req.employer.companyName,
      certificateId: certificate._id,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-certificate/${certificate._id}`
    }, pdfPath);
    
    // Upload PDF to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: 'raw',
      format: 'pdf',
      folder: 'skillchain/certificates'
    });
    
    // Update certificate with file URL
    certificate.fileUrl = uploadResult.secure_url;
    certificate.verificationUrl = `${process.env.FRONTEND_URL}/verify-certificate/${certificate._id}`;
    await certificate.save();
    
    // Add certificate to user's profile
    await User.findByIdAndUpdate(
      userId,
      { $push: { certificates: certificate._id } }
    );
    
    // Send email notification to user
    await sendCertificateEmail(
      user.email,
      user.name,
      certificate.title,
      certificate.verificationUrl
    );
    
    // Clean up local PDF file
    fs.unlinkSync(pdfPath);
    
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify certificate
const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = await Certificate.findById(certificateId)
      .populate('issuedTo', 'name email')
      .populate('issuedBy', 'companyName')
      .populate('skill', 'name level');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Verify on blockchain
    const blockchainVerification = await verifyBlockchainCertificate(certificate.blockchainHash);
    
    res.json({
      certificate,
      blockchainVerification: {
        verified: blockchainVerification !== null,
        details: blockchainVerification
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user certificates
const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ issuedTo: req.user._id })
      .populate('issuedBy', 'companyName')
      .populate('skill', 'name level');
    
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { issueCertificate, verifyCertificate, getUserCertificates };