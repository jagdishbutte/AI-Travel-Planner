export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  token: string;
  role: "user" | "admin";
  createdAt: string;
  location: string;
  age: string;
  mobile: string;
  nationality: string;
  occupation: string;
  passportNumber?: string;
  preferences?: UserPreferences;
  profilePicture?: string;
}

export interface UserPreferences {
  travelStyle: string[];
  destinations: string[];
  accommodation: string[];
  transportation: string[];
  activities: string[];
  budget: string[];
  tripLength: string[];
}

export interface Trip {
  id?: string;
  _id?: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: {
    amount: number;
    type: "per_person" | "total";
    duration: "per_day" | "entire_trip";
  };
  travelers: number;
  transportationType: "bus" | "train" | "flight";
  status: "draft" | "planned" | "ongoing" | "completed";
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
  weather?: WeatherInfo[];
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
  transportationDetails?: {
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
  totalCost?: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
    total: number;
  };
  image?: string;
}

export interface WeatherInfo {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}
