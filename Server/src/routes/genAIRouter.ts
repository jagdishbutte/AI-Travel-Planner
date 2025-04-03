import express from "express";
import { generateTripPlan } from "../controllers/genAIController";
import { TripPlan } from "../types/tripTypes";
import Trip from "../models/trip";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const tripPlan = await generateTripPlan(req.body);
    console.log("BODY:", req.body);
    const trip = new Trip({
      user: req.body.userId, 
      location: tripPlan.destination,
      days: req.body.days,
      travelers: tripPlan.travelers,
      budget: JSON.stringify(tripPlan.budget),
      preferences: req.body.preferences || {},
      itinerary: {
        summary: tripPlan.title,
        daily_itinerary: tripPlan.itinerary.map((day, index) => ({
          day: index + 1,
          activities: day.events.map((event) => event.title),
        })),
        accommodation: tripPlan.accommodation.map((hotel) => hotel.name),
        transportation: tripPlan.transportationDetails.details.map(
          (detail) => `${detail.from} to ${detail.to}`
        ),
        food_recommendations: tripPlan.itinerary.flatMap((day) =>
          day.events
            .filter((event) => event.type === "food")
            .map((event) => event.title)
        ),
        budget_breakdown: tripPlan.totalCost,
      },
    });

    await trip.save();

    res.json({
      ...tripPlan,
      _id: trip._id,
    });
  } catch (error) {
    console.error("Error generating trip:", error);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

export default router;
