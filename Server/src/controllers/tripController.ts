import { Request, Response } from "express";
import { RequestHandler } from "express";
import Trip from "../models/trip";
import mongoose, { Types } from "mongoose";

export const getUserTrips: RequestHandler = async (req, res): Promise<void> => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const trips = await Trip.find({
      user: new Types.ObjectId(userId as string),
    }).sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

export const getTrip: RequestHandler = async (req, res): Promise<void> => {
  try {
    const tripId = req.query.tripId as string;
    if (!tripId) {
      res.status(400).json({ error: "tripId is required" });
      return;
    } else {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        res.status(404).json({ error: "Trip not found" });
        return;
      }
      res.json(trip);
    }
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};

export const saveTrip: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, tripData } = req.body;
    if (!userId || !tripData) {
      res.status(400).json({
        success: false,
        message: "userId and tripData are required",
      });
      return;
    }
    const trip = new Trip({
      ...tripData,
      user: new mongoose.Types.ObjectId(userId),
    });
    await trip.save();
    res.status(201).json({
      success: true,
      message: "Trip saved successfully",
      trip,
    });
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ error: "Failed to save trip" });
  }
};

export const deleteTrip: RequestHandler = async (req, res): Promise<void> => {
  try {
    const id = req.query.tripId as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid trip ID format",
      });
      return;
    }

    // Find the trip first to check if it exists
    const trip = await Trip.findById(id);

    if (!trip) {
      res.status(404).json({
        success: false,
        message: "Trip not found",
      });
      return;
    }

    // Delete the trip
    await Trip.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
    return;
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete trip",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
};

export const getAllTripsForAdmin: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const trips = await Trip.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips for admin:", error);
    res.status(500).json({ error: "Failed to fetch trips for admin" });
  }
};
