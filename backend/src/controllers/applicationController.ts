import { Request, Response } from 'express';
import Application from '../models/Application';

// GET ALL APPLICATIONS (Filtered by User)
export const getApplications = async (req: any, res: Response) => {
  try {
    // ONLY find applications where the user ID matches the logged-in user
    const applications = await Application.find({ user: req.user.id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// CREATE NEW APPLICATION
export const createApplication = async (req: any, res: Response) => {
  try {
    const { company, role, status } = req.body;

    const newApp = new Application({
      company,
      role,
      status,
      user: req.user.id // Assign the application to this specific user
    });

    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (error) {
    res.status(500).json({ message: 'Error saving application' });
  }
};