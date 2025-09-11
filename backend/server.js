import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import applicationJobsRoutes from './routes/applicationJobsRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

// Serve static files
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Routes

app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/applications', applicationJobsRoutes);
app.use("/api/skills", skillRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'SkillChain API is running!' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

