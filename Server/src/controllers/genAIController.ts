import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { TripPlan, GenerateTripRequest } from "../types/tripTypes";
import { generateTripPrompt } from "../utils/tripPrompt";

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
