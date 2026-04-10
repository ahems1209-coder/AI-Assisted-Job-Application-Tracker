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
app.use(cors());
app.use(express.json());

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live: http://localhost:${PORT}`);
});