import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { TripPlan, GenerateTripRequest } from "../types/tripTypes";
import { generateTripPrompt } from "../utils/tripPrompt";
import Trip from "../models/trip";
import { Request, Response } from "express";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const UNSPALSH_ACCESS_KEY = process.env.UNSPALSH_ACCESS_KEY;

// Function to fetch a travel image from Unsplash
const fetchUnsplashImage = async (
    destination: string
): Promise<string | undefined> => {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${destination}&client_id=${UNSPALSH_ACCESS_KEY}`
        );
        const data = await response.json();

        if (data) {
            return data.results[0].urls.regular; 
        }
    } catch (error) {
        console.error("Error fetching Unsplash image:", error);
    }
    return undefined;
};

// Function to fetch hotel images
const fetchHotelImage = async (
    hotelName: string,
    destination: string
): Promise<string | undefined> => {
    try {
        // Combine hotel name with destination for better results
        const query = `${hotelName} hotel ${destination}`;
        // console.log(query, "query");
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPALSH_ACCESS_KEY}`
        );
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
        } else {
            // Fallback to generic hotel images if specific hotel not found
            const fallbackResponse = await fetch(
                `https://api.unsplash.com/search/photos?query=hotel ${destination}&client_id=${UNSPALSH_ACCESS_KEY}`
            );
            const fallbackData = await fallbackResponse.json();
            
            if (fallbackData && fallbackData.results && fallbackData.results.length > 0) {
                return fallbackData.results[0].urls.regular;
            }
        }
    } catch (error) {
        console.error(`Error fetching hotel image for ${hotelName}:`, error);
    }
    return undefined;
};

// Function to generate a trip plan
export const generateTripPlan = async (
    req: GenerateTripRequest
): Promise<TripPlan> => {
    try {
        const prompt = generateTripPrompt(req);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const content = response.text();
        // console.log("Gemini response:", content);

        if (!content) {
            throw new Error("No content received from Gemini.");
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in Gemini response.");
        }

        const tripPlan: TripPlan = JSON.parse(jsonMatch[0]);

        // Fetch an image for the destination
        const destination = req.location || "travel"; // Use a default if missing
        const imageUrl = await fetchUnsplashImage(destination);
        
        if (tripPlan.accommodation && Array.isArray(tripPlan.accommodation)) {
            // Use Promise.all to fetch all hotel images concurrently
            await Promise.all(
                tripPlan.accommodation.map(async (hotel, index) => {
                    if (hotel && hotel.name) {
                        const hotelImageUrl = await fetchHotelImage(
                            hotel.name,
                            destination
                        );
                        if (hotelImageUrl) {
                            tripPlan.accommodation[index].image = hotelImageUrl;
                        } else {
                            tripPlan.accommodation[index].image =
                                "No image available";
                        }
                    }
                })
            );
        }

        // Add generated ID, status, and image URL
        tripPlan.id = Math.random().toString(36).substr(2, 9);
        tripPlan.status = "planned";
        tripPlan.image = imageUrl || "No image available";

        return {
            ...tripPlan,
            image: imageUrl || ""
        };
    } catch (error) {
        console.error("Error generating trip plan:", error);
        throw new Error("Failed to generate trip plan.");
    }
};

// API function
export const tripAPI = {
    generateAITrip: async (data: GenerateTripRequest) => {
        try {
            const response = await generateTripPlan(data);
            return response;
        } catch (error) {
            console.error("Error in generateAITrip:", error);
            throw error;
        }
    },
};

// export const saveTripPlan = async (req: Request, res: Response) => {
//     try {
//         const tripPlan: TripPlan = JSON.parse(req.body as unknown as string);

//         const trip = new Trip({
//             user: tripPlan.id,
//             title: tripPlan.title,
//             destination: tripPlan.destination,
//             days: tripPlan.days,
//             travelers: tripPlan.travelers,
//             budget: JSON.stringify(tripPlan.budget),
//             preferences: tripPlan.preferences || {},
//             itinerary: tripPlan.itinerary.map((day) => ({
//                 date: day.date,
//                 events: day.events.map((event) => ({
//                     time: event.time,
//                     title: event.title,
//                     description: event.description,
//                     type: event.type,
//                     location: event.location
//                         ? {
//                               name: event.location.name,
//                               coordinates: event.location.coordinates,
//                               address: event.location.address,
//                           }
//                         : undefined,
//                     cost: event.cost,
//                     duration: event.duration,
//                     bookingRequired: event.bookingRequired,
//                     bookingUrl: event.bookingUrl,
//                 })),
//                 weather: {
//                     condition: day.weather.condition,
//                     temperature: day.weather.temperature,
//                     humidity: day.weather.humidity,
//                     precipitation: day.weather.precipitation,
//                 },
//             })),
//             transportationType: tripPlan.transportationType,
//             image: tripPlan.image,
//             tipStatus: tripPlan.status || "planned",
//             startDate: tripPlan.startDate,
//             endDate: tripPlan.endDate,
//             weather: tripPlan.weather,
//             accommodation: tripPlan.accommodation.map((hotel) => ({
//                 name: hotel.name,
//                 image: hotel.image,
//                 price: hotel.price,
//                 rating: hotel.rating,
//                 description: hotel.description,
//                 amenities: hotel.amenities || [],
//                 location: {
//                     name: hotel.name,
//                     coordinates: hotel.location?.coordinates || [],
//                     address: hotel.location?.address || "",
//                 },
//                 roomTypes:
//                     hotel.roomTypes?.map((room) => ({
//                         type: room.type,
//                         price: room.price,
//                         capacity: room.capacity,
//                         available: room.available,
//                     })) || [],
//                 contactInfo: {
//                     phone: hotel.contactInfo?.phone || "",
//                     email: hotel.contactInfo?.email || "",
//                     website: hotel.contactInfo?.website || "",
//                 },
//                 bookingRequired: false, // or set based on your logic if available
//                 bookingUrl: hotel.contactInfo?.website || "",
//             })),
//             totalCost: {
//                 accommodation: tripPlan.totalCost.accommodation,
//                 activities: tripPlan.totalCost.activities,
//                 transportation: tripPlan.totalCost.transportation,
//                 food: tripPlan.totalCost.food,
//                 total: tripPlan.totalCost.total,
//             },
//         });

//         await trip.save();

//         res.status(201).json({
//             message: "Trip saved successfully",
//             tripId: trip._id,
//         });
//         return;
//     } catch (error) {
//         console.error("Error saving trip:", error);
//         res.status(500).json({ error: "Failed to save trip" });
//         return;
//     }
// };
