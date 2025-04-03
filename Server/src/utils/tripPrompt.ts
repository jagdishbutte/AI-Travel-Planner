import { GenerateTripRequest } from "../types/tripTypes";

export const generateTripPrompt = (
  req: GenerateTripRequest
): string => {
  return `Generate a detailed travel itinerary for a trip with the following specifications:
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
    - Activity Level: ${req.preferences.activityLevel}
    - Interests: ${req.preferences.interests?.join(", ")}
    - Dietary Restrictions: ${req.preferences.dietaryRestrictions?.join(", ")}
    - Accommodation Type: ${req.preferences.accommodationType}
    `
            : ""
    }

    Please provide a detailed JSON response with:
    {
      "id": "generated-id",
      "title": "Trip to [Destination]",
      "destination": "[location]",
      "startDate": "[startDate]",
      "endDate": "[endDate]",
      "budget": {
        "amount": [number],
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
              "title": "Event name",
              "description": "Detailed description",
              "type": "[activity/transport/food/accommodation]",
              "location": {
                "name": "Location name",
                "coordinates": [lat, long],
                "address": "Full address"
              },
              "cost": [number],
              "duration": "Duration in hours",
              "bookingRequired": true/false,
              "bookingUrl": "URL if applicable"
            }
          ],
          "weather": {
            "condition": "[sunny/cloudy/rainy/snowy/windy]",
            "temperature": [number],
            "humidity": [number],
            "precipitation": [number]
          }
        }
      ],
      "accommodation": [
        {
          "id": "unique-id",
          "name": "Hotel name",
          "image": "find hotels image URL",
          "rating": [number 1-5],
          "price": [number],
          "description": "Detailed description",
          "amenities": ["amenity1", "amenity2"],
          "location": {
            "coordinates": [lat, long],
            "address": "Full address"
          },
          "roomTypes": [
            {
              "type": "Room type",
              "price": [number],
              "capacity": [number],
              "available": true/false
            }
          ],
          "contactInfo": {
            "phone": "phone number",
            "email": "email",
            "website": "URL"
          }
        }
      ],
      "transportationDetails": {
        "type": "[flight/train/bus]",
        "details": [
          {
            "from": "Origin",
            "to": "Destination",
            "departure": "ISO datetime",
            "arrival": "ISO datetime",
            "provider": "Provider name",
            "price": [number],
            "duration": "Duration in hours",
            "stops": [number],
            "bookingReference": "Reference if applicable"
          }
        ]
      },
      "totalCost": {
        "accommodation": [number],
        "transportation": [number],
        "activities": [number],
        "food": [number],
        "total": [number]
      }
    }, 
    PLease keep it in JSON format strictly. No any special character or comments allowed`;
};
