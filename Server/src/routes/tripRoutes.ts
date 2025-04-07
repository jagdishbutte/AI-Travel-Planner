import express from "express";
import {
  deleteTrip,
  getTrip,
} from "../controllers/tripController";
import { generateTripPlan } from "../controllers/genAIController";

const router = express.Router();

//Fetch all trips for a user
router.get("/fetchTrips", getTrip);

// Delete a trip
router.delete("/deleteTrip", deleteTrip);

export default router;