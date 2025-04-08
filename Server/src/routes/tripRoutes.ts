import express from "express";
import {
  deleteTrip,
  getTrip,
  getUserTrips,
} from "../controllers/tripController";
import { generateTripPlan } from "../controllers/genAIController";

const router = express.Router();

//Fetch all trips for a user
router.get("/fetchTrips", getUserTrips);
// Get a trip by ID
router.get("/getTrip", getTrip);
// Delete a trip
router.delete("/deleteTrip", deleteTrip);

export default router;