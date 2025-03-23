import express, { Request, Response } from "express";
import { generateTripPlan } from "../controllers/genAIController";
import { TripPlan } from "../types/tripTypes";

const router = express.Router();

router.post("/generate-trip", async (req: Request, res: Response) => {
  try {
    const { location, days, travelers, budget } = req.body;

    // if (!location || !days || !travelers || !budget) {
    //   return res.status(400).json({ error: "Missing required parameters" });
    // }

    const tripPlan: TripPlan = await generateTripPlan(
      location,
      days,
      travelers,
      budget
    );

    res.json({ tripPlan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
