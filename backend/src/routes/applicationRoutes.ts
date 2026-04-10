import express from 'express';
import { getApplications, createApplication } from '../controllers/applicationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Both routes now use 'protect'
router.get('/', protect, getApplications);
router.post('/', protect, createApplication);

export default router;