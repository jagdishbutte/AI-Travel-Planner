import { Request, Response } from "express";
import User from "../models/users";
import Trip from "../models/trip";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();

    const topDestinations = await Trip.aggregate([
      { $group: { _id: "$destination", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const tripStatusDistribution = await Trip.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    const recentTrips = await Trip.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.status(200).json({
      totalUsers,
      totalTrips,
      topDestinations,
      tripStatusDistribution,
      recentUsers,
      recentTrips,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error,
    });
  }
};
