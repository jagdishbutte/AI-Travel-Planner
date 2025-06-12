import express from "express";
import { getDashboardStats } from "../controllers/adminController";
import { getAllTripsForAdmin } from "../controllers/tripController";

const router = express.Router();

// TODO: Add authentication and authorization middleware to protect these routes
// Example: router.use(isAuthenticated, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/trips", getAllTripsForAdmin);

export default router;
