import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateCertificatePDF = (certificateData, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4'
      });

      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

      // Add border
      doc.strokeColor('#4f46e5')
        .lineWidth(15)
        .roundedRect(30, 30, doc.page.width - 60, doc.page.height - 60, 10)
        .stroke();

      // Add title
      doc.fontSize(32)
        .font('Helvetica-Bold')
        .fillColor('#1f2937')
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 120, { align: 'center' });

      // Add subtitle
      doc.fontSize(18)
        .font('Helvetica')
        .fillColor('#4b5563')
        .text('This certifies that', 0, 180, { align: 'center' });

      // Add recipient name
      doc.fontSize(30)
        .font('Helvetica-Bold')
        .fillColor('#4f46e5')
        .text(certificateData.userName, 0, 220, { align: 'center' });

      // Add achievement text
      doc.fontSize(16)
        .font('Helvetica')
        .fillColor('#4b5563')
        .text(`has successfully demonstrated ${certificateData.skillLevel} proficiency in`, 0, 280, { align: 'center' });

      // Add skill name
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#1f2937')
        .text(certificateData.skillName, 0, 320, { align: 'center' });

      // Add description
      doc.fontSize(14)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text(certificateData.description, 50, 370, { 
          align: 'center',
          width: doc.page.width - 100
        });

      // Add issue date
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text(`Issued on: ${new Date(certificateData.issueDate).toLocaleDateString()}`, 50, 450, { align: 'center' });

      // Add issuer
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#4b5563')
        .text(certificateData.issuerName, doc.page.width - 200, doc.page.height - 100, { align: 'right' });

      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text('SkillChain Verified Issuer', doc.page.width - 200, doc.page.height - 80, { align: 'right' });

      // Add verification info
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#9ca3af')
        .text(`Certificate ID: ${certificateData.certificateId}`, 50, doc.page.height - 50);

      doc.text(`Verify at: ${certificateData.verificationUrl}`, 50, doc.page.height - 35);

      // Finalize the PDF
      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default generateCertificatePDF;