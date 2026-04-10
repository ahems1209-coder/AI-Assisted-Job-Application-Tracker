import express, { Request, Response } from 'express';
import Application from '../models/Application';
import { parseJobDescription } from '../services/ai.service';

const router = express.Router();

// GET all apps for the board
router.get('/', async (req: Request, res: Response) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

// AI Parse & Suggestion Generation
router.post('/parse', async (req: Request, res: Response) => {
  try {
    const result = await parseJobDescription(req.body.jdText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "AI Parsing failed" });
  }
});

// CREATE application
router.post('/', async (req: Request, res: Response) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
});

// UPDATE status (For Drag and Drop)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE application
router.delete('/:id', async (req: Request, res: Response) => {
  await Application.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;