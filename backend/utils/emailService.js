// Placeholder for utils/emailService.js

import nodemailer from 'nodemailer';

// Configure the email transporter

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCertificateEmail = async (toEmail, userName, certificateTitle, certificateUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Your ${certificateTitle} Certificate from SkillChain`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Congratulations, ${userName}!</h2>
          <p>You have been awarded a certificate for ${certificateTitle} on SkillChain.</p>
          <p>You can view and download your certificate from the following link:</p>
          <p><a href="${certificateUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Certificate</a></p>
          <p>This certificate has been securely stored on the blockchain for verification purposes.</p>
          <br>
          <p>Best regards,<br>The SkillChain Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Certificate email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

const sendJobApplicationEmail = async (toEmail, userName, jobTitle, companyName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Application Confirmation for ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your application, ${userName}!</h2>
          <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received.</p>
          <p>We will review your application and get back to you soon.</p>
          <br>
          <p>Best regards,<br>The ${companyName} Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Job application email sent successfully');
  } catch (error) {
    console.error('Error sending job application email:', error);
    throw new Error('Failed to send job application email');
  }
};

export { sendCertificateEmail, sendJobApplicationEmail };