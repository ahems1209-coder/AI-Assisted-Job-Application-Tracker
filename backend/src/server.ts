import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';

// 1. Load Config
dotenv.config();

// 2. Initialize App
const app = express();

// 3. Connect Database
connectDB();

// 4. Middleware
app.use(cors({
  origin: 'https://69d8d932756458080ed9a578--ai-job-applicationtracker.netlify.app'
}));
app.use(express.json());

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});