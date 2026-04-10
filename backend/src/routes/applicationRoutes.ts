import express from 'express';
import { getApplications, createApplication, parseAI } from '../controllers/applicationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // Secures all routes below

router.get('/', getApplications);
router.post('/', createApplication);
router.post('/parse', parseAI); 

export default router;