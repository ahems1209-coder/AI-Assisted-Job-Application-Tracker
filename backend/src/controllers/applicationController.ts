import { Request, Response } from 'express';
import Application from '../models/Application';
import { parseJobWithAI } from '../services/ai.service';

// AI Parsing Logic
export const parseAI = async (req: any, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: "Description required" });

    const aiData = await parseJobWithAI(description);
    res.json(aiData);
  } catch (error) {
    res.status(500).json({ message: "AI Error" });
  }
};

// Create Application (Now with User ID)
export const createApplication = async (req: any, res: Response) => {
  try {
    const newApp = new Application({
      ...req.body,
      user: req.user.id // Critical for data isolation
    });
    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (error) {
    res.status(500).json({ message: "Save Error" });
  }
};

// Get Applications (Now filtered by User)
export const getApplications = async (req: any, res: Response) => {
  try {
    const apps = await Application.find({ user: req.user.id });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error" });
  }
};