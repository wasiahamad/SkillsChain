// Placeholder for routes/certificateRoutes.js

import express from 'express';
import { issueCertificate, verifyCertificate, getUserCertificates } from '../controllers/certificateController.js';
import { protectEmployer } from '../middlewares/authMiddleware.js';
import { protectUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/issue', protectEmployer, issueCertificate);
router.get('/verify/:certificateId', verifyCertificate);
router.get('/user', protectUser, getUserCertificates);

export default router;