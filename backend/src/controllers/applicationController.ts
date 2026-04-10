import { Request, Response } from 'express';
import Application from '../models/Application';
import { parseJobWithAI } from '../services/ai.service';

export const parseAI = async (req: any, res: Response) => {
  try {
    // The 400 error happens if 'description' isn't sent correctly
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "No description provided" });
    }

    const aiData = await parseJobWithAI(description);
    return res.status(200).json(aiData);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Also adding the user-specific save/fetch logic for recruiters
export const createApplication = async (req: any, res: Response) => {
  try {
    const newApp = new Application({ ...req.body, user: req.user.id });
    await newApp.save();
    return res.status(201).json(newApp);
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