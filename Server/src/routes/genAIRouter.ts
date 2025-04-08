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
        destination: tripPlan.destination,
        days: req.body.days,
        travelers: tripPlan.travelers,
        budget: JSON.stringify(tripPlan.budget),
        preferences: req.body.preferences || {},
        itinerary: tripPlan.itinerary.map((day) => ({
            date: day.date,
            events: day.events.map((event) => ({
                time: event.time,
                title: event.title,
                description: event.description,
                type: event.type, // "activity" | "transport" | "food" | "accommodation"
                location: event.location
                    ? {
                          name: event.location.name,
                          coordinates: event.location.coordinates,
                          address: event.location.address,
                      }
                    : undefined,
                cost: event.cost,
                duration: event.duration,
                bookingRequired: event.bookingRequired,
                bookingUrl: event.bookingUrl,
            })),
            weather: {
                condition: day.weather.condition, // "sunny" | "cloudy" | etc.
                temperature: day.weather.temperature,
                humidity: day.weather.humidity,
                precipitation: day.weather.precipitation,
            },
        })),

        transportationType: req.body.transportationType,
        image: tripPlan.image,
        status: "planned",
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        weather: tripPlan.weather,
        accommodation: tripPlan.accommodation.map((hotel) => ({
            name: hotel.name,
            image: hotel.image,
            price: hotel.price,
            rating: hotel.rating,
            description: hotel.description,
            amenities: hotel.amenities || [],
            location: {
                name: hotel.name,
                coordinates: hotel.location?.coordinates || [],
                address: hotel.location?.address || "",
            },
            roomTypes:
                hotel.roomTypes?.map((room) => ({
                    type: room.type,
                    price: room.price,
                    capacity: room.capacity,
                    available: room.available,
                })) || [],
            contactInfo: {
                phone: hotel.contactInfo?.phone || "",
                email: hotel.contactInfo?.email || "",
                website: hotel.contactInfo?.website || "",
            },
            bookingRequired: false, // or set to true if you have that info
            bookingUrl: hotel.contactInfo?.website || "",
        })),
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
