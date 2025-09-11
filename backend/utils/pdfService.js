import PDFDocument from "pdfkit";
import fs from "fs";

export const generateCertificatePDF = (certificateText, fileName) => {
    const doc = new PDFDocument();
    const path = `certificates/${fileName}.pdf`;
    doc.pipe(fs.createWriteStream(path));
    doc.fontSize(25).text("Certificate of Achievement", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(certificateText, { align: "center" });
    doc.end();
    return path;
};
