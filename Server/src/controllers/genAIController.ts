import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { generateTripPrompt } from "../utils/tripPrompt";
import { TripPlan } from "../types/tripTypes";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateTripPlan = async (
  location: string,
  days: number,
  travelers: number,
  budget: string
): Promise<TripPlan> => {
  try {
    const prompt = generateTripPrompt(location, days, travelers, budget);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    let content = response.text();

    if (!content) {
      throw new Error("No content received from Gemini.");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/); 
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response.");
    }

    const jsonString = jsonMatch[0]; 
    const tripPlan: TripPlan = JSON.parse(jsonString);

    return tripPlan;
  } catch (error) {
    console.error("Error generating trip plan:", error);
    throw new Error("Failed to generate trip plan.");
  }
};
