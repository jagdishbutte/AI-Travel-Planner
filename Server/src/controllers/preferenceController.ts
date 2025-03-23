import { RequestHandler } from "express";
import Preferences from "../models/preferences";
import User from "../models/users";

const saveUserPreferences: RequestHandler = async (req, res) => {
  const {
    userId,
    tripLength,
    budget,
    travelStyle,
    destinations,
    activities,
    transportation,
    accommodation,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let preferences = await Preferences.findOne({ userId });

    if (preferences) {
      // Update existing preferences
      preferences.tripLength = tripLength;
      preferences.budget = budget;
      preferences.travelStyle = travelStyle;
      preferences.destinations = destinations;
      preferences.activities = activities;
      preferences.transportation = transportation;
      preferences.accommodation = accommodation;
    } else {
      // Create new preferences
      preferences = new Preferences({
        userId,
        tripLength,
        budget,
        travelStyle,
        destinations,
        activities,
        transportation,
        accommodation,
      });

      // Save the reference in the User model
      user.preferences = preferences._id;
      await user.save();
    }

    await preferences.save();
    res.status(201).json({ message: "Preferences saved successfully" });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default saveUserPreferences;
