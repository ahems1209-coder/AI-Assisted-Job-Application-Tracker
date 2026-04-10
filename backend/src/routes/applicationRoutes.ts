import express from 'express';
import { getApplications, createApplication, parseAI } from '../controllers/applicationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All application routes should be protected
router.use(protect); 

router.get('/', getApplications);
router.post('/', createApplication);
router.post('/parse', parseAI); // The endpoint for the AI button

export default router;