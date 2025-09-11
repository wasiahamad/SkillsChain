// Placeholder for routes/employerRoutes.js

import express from 'express';
import { registerEmployer, loginEmployer, getEmployerProfile, updateEmployerProfile } from '../controllers/employerController.js';
import { protectEmployer } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/profile', protectEmployer, getEmployerProfile);
router.put('/:id/profile', protectEmployer, updateEmployerProfile);

export default router;