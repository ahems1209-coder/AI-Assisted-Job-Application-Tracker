import { Request, Response } from 'express';
import Application from '../models/Application';
import { parseJobWithAI } from '../services/ai.service';

// 1. AI Parsing Logic
export const parseAI = async (req: any, res: Response) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description field is required" });
    }

    const aiData = await parseJobWithAI(description);
    return res.json(aiData);
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({ message: "Internal Server Error during AI parsing" });
  }
};

// 2. Get ONLY current user's applications
export const getApplications = async (req: any, res: Response) => {
  try {
    // req.user.id comes from your protect middleware
    const apps = await Application.find({ user: req.user.id });
    return res.json(apps);
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ message: "Error fetching applications" });
  }
};

// 3. Create application linked to current user
export const createApplication = async (req: any, res: Response) => {
  try {
    const newApp = new Application({
      ...req.body,
      user: req.user.id 
    });

    const savedApp = await newApp.save();
    return res.status(201).json(savedApp);
  } catch (error) {
    console.error("Save Error:", error);
    return res.status(500).json({ message: "Error saving application" });
  }
};