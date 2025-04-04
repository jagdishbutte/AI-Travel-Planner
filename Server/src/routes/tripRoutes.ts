import express from "express";
import {
  deleteTrip,
} from "../controllers/tripController";
import { generateTripPlan } from "../controllers/genAIController";

const router = express.Router();

// Delete a trip
router.delete("/:id", deleteTrip);

export default router;