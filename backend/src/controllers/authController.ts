import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, password });
    res.status(201).json({ token: generateToken(user._id.toString()) });
  } catch (error: any) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting login for: ${email}`);

    const user: any = await User.findOne({ email });
    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Checking if comparePassword method exists, otherwise using direct comparison for setup
    const isMatch = user.comparePassword ? await user.comparePassword(password) : (password === user.password);

    if (isMatch) {
      console.log("✅ Login successful");
      res.json({ token: generateToken(user._id.toString()) });
    } else {
      console.log("❌ Password mismatch");
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};