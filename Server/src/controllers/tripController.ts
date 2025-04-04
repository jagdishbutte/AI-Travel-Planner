import { Request, Response } from "express";
import { RequestHandler } from "express";
import Trip from "../models/trip";
import mongoose from "mongoose";

export const deleteTrip: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ObjectId
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
