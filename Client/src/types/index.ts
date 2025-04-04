export interface User {
  id: string;
  email: string;
  location?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  travelStyle: string[];
  destinations: string[];
  foodPreferences: string[];
}

export interface Trip {
  id: string;
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
  itinerary: DayPlan[];
  weather?: WeatherInfo[];
  accommodation: Accommodation[];
  image?: string;
}

export interface DayPlan {
  date: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  description: string;
  location: string;
  type: "sightseeing" | "food" | "activity" | "transport";
}

export interface WeatherInfo {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface Accommodation {
  name: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
}
