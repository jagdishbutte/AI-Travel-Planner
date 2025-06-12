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

        res.status(200).json({
            totalUsers,
            totalTrips,
            topDestinations,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard stats",
            error,
        });
    }
};
