import { Response } from 'express';
import Application from '../models/Application';
import { parseJobWithAI } from '../services/ai.service';

export const parseAI = async (req: any, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: "No description" });

    const aiData = await parseJobWithAI(description);
    return res.json(aiData);
  } catch (error) {
    return res.status(500).json({ message: "AI Error" });
  }
};

export const createApplication = async (req: any, res: Response) => {
  try {
    const newApp = new Application({
      ...req.body,
      user: req.user.id // Critical for isolating data
    });
    const savedApp = await newApp.save();
    return res.status(201).json(savedApp);
  } catch (error) {
    return res.status(500).json({ message: "Save failed" });
  }
};

export const getApplications = async (req: any, res: Response) => {
  try {
    const apps = await Application.find({ user: req.user.id });
    return res.json(apps);
  } catch (error) {
    return res.status(500).json({ message: "Fetch failed" });
  }
};