import express, { RequestHandler } from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Preferences from "../models/preferences";

dotenv.config();
const app = express();

const userRegister: RequestHandler = async (req, res) => {
  const {
    email,
    password,
    name,
    mobile,
    location,
    age,
    nationality,
    occupation,
    // emergencyContact,
    passportNumber,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      mobile,
      location,
      age,
      nationality,
      occupation,
      // emergencyContact,
      passportNumber,
    });

    // Save user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const userLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const fetchPreferences = await Preferences.findOne({ userId: user._id }, {
      travelStyle: 1,
      destinations: 1,
      accommodation: 1,
      transportation: 1,
      activities: 1,
      budget: 1,
      tripLength: 1,
    });

    const preferences = {
        travelStyle: fetchPreferences?.travelStyle,
        destinations: fetchPreferences?.destinations,
        accommodation: fetchPreferences?.accommodation,
        transportation: fetchPreferences?.transportation,
        activities: fetchPreferences?.activities,
        budget: fetchPreferences?.budget,
        tripLength: fetchPreferences?.tripLength,
    };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.json({
        message: "You are logged in successfully!",
        userId: user._id,
        token: token,
        preferences: preferences,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const userController = {
  userRegister,
  userLogin,
};
