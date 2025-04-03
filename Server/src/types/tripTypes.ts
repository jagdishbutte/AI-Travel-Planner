export interface Hotel {
  hotelName: string;
  hotelAddress: string;
  price: string;
  hotelImageUrl: string;
  geoCoordinates: { lat: number; lng: number };
  rating: number;
  description: string;
}

export interface Place {
  placeName: string;
  placeDetails: string;
  placeImageUrl: string;
  geoCoordinates: { lat: number; lng: number };
  ticketPricing: string;
  bestTimeToVisit: string;
}

export interface Itinerary {
  day: number;
  places: Place[];
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: {
    amount: number;
    type: "per_person" | "total";
    duration: "entire_trip" | "per_day";
  };
  travelers: number;
  transportationType: "flight" | "train" | "bus";
  status: "planned" | "ongoing" | "completed";

  // Itinerary details
  itinerary: Array<{
    date: string;
    events: Array<{
      time: string;
      title: string;
      description: string;
      type: "activity" | "transport" | "food" | "accommodation";
      location?: {
        name: string;
        coordinates: [number, number];
        address?: string;
      };
      cost?: number;
      duration?: string;
      bookingRequired?: boolean;
      bookingUrl?: string;
    }>;
    weather: {
      condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy";
      temperature: number;
      humidity?: number;
      precipitation?: number;
    };
  }>;

  // Accommodation options
  accommodation: Array<{
    id: string;
    name: string;
    image: string;
    rating: number;
    price: number;
    description: string;
    amenities: string[];
    location: {
      coordinates: [number, number];
      address: string;
    };
    roomTypes?: Array<{
      type: string;
      price: number;
      capacity: number;
      available: boolean;
    }>;
    contactInfo?: {
      phone?: string;
      email?: string;
      website?: string;
    };
  }>;

  // Transportation details
  transportationDetails: {
    type: "flight" | "train" | "bus";
    details: Array<{
      from: string;
      to: string;
      departure: string;
      arrival: string;
      provider: string;
      price: number;
      duration: string;
      stops?: number;
      bookingReference?: string;
    }>;
  };

  // Additional trip details
  image: string;
  totalCost: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
    total: number;
  };
  preferences?: {
    activityLevel: "relaxed" | "moderate" | "intensive";
    interests: string[];
    dietaryRestrictions?: string[];
    accommodationType: "budget" | "mid_range" | "luxury";
  };
  weather: Array<{
    condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy";
    temperature: number;
    date: string;
  }>;
}

export interface GenerateTripRequest {
  location: string;
  days: number;
  travelers: number;
  budget: {
    amount: number;
    type: "per_person" | "total";
    duration: "entire_trip" | "per_day";
  };
  transportationType: "flight" | "train" | "bus";
  startDate: string;
  endDate: string;
  preferences?: {
    activityLevel?: "relaxed" | "moderate" | "intensive";
    interests?: string[];
    dietaryRestrictions?: string[];
    accommodationType?: "budget" | "mid_range" | "luxury";
  };
}
