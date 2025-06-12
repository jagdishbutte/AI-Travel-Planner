import express from "express";
import { getDashboardStats } from "../controllers/adminController";

const router = express.Router();

// TODO: Add authentication and authorization middleware to protect these routes
// Example: router.use(isAuthenticated, isAdmin);

router.get("/stats", getDashboardStats);

export default router;
