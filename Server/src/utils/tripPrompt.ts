import { GenerateTripRequest } from "../types/tripTypes";

export const generateTripPrompt = (req: GenerateTripRequest): string => {
    return `Generate a comprehensive and practical travel itinerary for a trip with the following specifications:

    - Destination: ${req.location}
    - Duration: ${req.days} days
    - Number of travelers: ${req.travelers}
    - Budget: ${req.budget.amount} ${req.budget.type} for ${req.budget.duration}
    - Transportation: ${req.transportationType}
    - Start Date: ${req.startDate}
    - End Date: ${req.endDate}
    ${
        req.preferences
            ? `
    - Trip Length: ${req.preferences.tripLength}
    - Budget: ${req.preferences.budget}
    - Travel Style: ${req.preferences.travelStyle}
    - Destinations: ${req.preferences.destinations?.join(", ")}
    - Activities: ${req.preferences.activities?.join(", ")}
    - Transportation: ${req.preferences.transportation}
    - Accommodation: ${req.preferences.accommodation}
    `
            : ""
    }

    Please provide a detailed JSON response with the following structure, ensuring all fields are populated with real, accurate, and practical data. Focus on creating a realistic and engaging itinerary that reflects the destination's unique offerings. Provide multiple hotel recommendations where applicable.

    {
      "id": "A unique identifier for this trip itinerary.",
      "title": "A concise title for the trip, e.g., 'Exploring [Destination]'.",
      "destination": "[location]",
      "startDate": "[startDate]",
      "endDate": "[endDate]",
      "budget": {
        "amount": [number] in Indian Reupees,
        "type": "[per_person/total]",
        "duration": "[entire_trip/per_day]"
      },
      "travelers": [number],
      "transportationType": "[flight/train/bus]",
      "status": "planned",
      "itinerary": [
        {
          "date": "YYYY-MM-DD",
          "events": [
            {
              "time": "HH:MM",
              "title": "Event name.",
              "description": "Detailed and practical description of the event.",
              "type": "[activity/transport/food/accommodation]",
              "location": {
                "name": "Location name.",
                "coordinates": [latitude, longitude],
                "address": "Full address."
              },
              "cost": [number, or 0 if not available] in Indian Reupees,
              "duration": "Duration in hours, or '0' if not available.",
              "bookingRequired": true/false,
              "bookingUrl": "URL if applicable, or '' if not available."
            }
          ],
          "weather": {
            "condition": "[sunny/cloudy/rainy/snowy/windy], or '' if not available",
            "temperature": [number, or 0 if not available],
            "humidity": [number, or 0 if not available],
            "precipitation": [number, or 0 if not available]
          }
        }
      ],
      "accommodation": [
        {
          "id": "unique-id",
          "name": "Hotel name.",
          "image": "Real URL of an image of the hotel, or '' if not available.",
          "rating": [number 1-5, or 0 if not available],
          "price": [number, or 0 if not available] in Indian Reupees,
          "description": "Detailed description of the hotel.",
          "amenities": ["amenity1", "amenity2", ...],
          "location": {
            "coordinates": [latitude, longitude],
            "address": "Full address."
          },
          "roomTypes": [
            {
              "type": "Room type.",
              "price": [number, or 0 if not available] in Indian Reupees,
              "capacity": [number, or 0 if not available],
              "available": true/false
            }
          ],
          "contactInfo": {
            "phone": "phone number, or '' if not available.",
            "email": "email, or '' if not available.",
            "website": "URL, or '' if not available."
          }
        },
        //Include multiple hotels if available.
      ],
      "transportationDetails": {
        "type": "[flight/train/bus]",
        "details": [
          {
            "from": "Origin.",
            "to": "Destination.",
            "departure": "ISO datetime.",
            "arrival": "ISO datetime.",
            "provider": "Provider name, or '' if not available.",
            "price": [number, or 0 if not available] in Indian Reupees,
            "duration": "Duration in hours, or '0' if not available.",
            "stops": [number, or 0 if not available],
            "bookingReference": "Reference if applicable, or '' if not available."
          }
        ]
      },
      "totalCost": {
        "accommodation": [number, or 0 if not available] in Indian Reupees,
        "transportation": [number, or 0 if not available] in Indian Reupees,
        "activities": [number, or 0 if not available] in Indian Reupees,
        "food": [number, or 0 if not available] in Indian Reupees,
        "total": [number, or 0 if not available] in Indian Reupees
      },
      "image": "Real URL of a destination image, or '' if not available."
    }

    Strictly adhere to the JSON format. Do not include any additional text, explanations, or comments outside of the JSON structure. If specific information cannot be found, provide a reasonable default or empty values. Do not use null values. Do not use placeholders. Provide real and practical itinerary. Itinerarary should be long and all inclusive. All prices should be in Indian rupees and provide practical proces according to real life. Give multiple hotel recommendations if possible. Give real image urls for hotels and destination.
    `;
};
