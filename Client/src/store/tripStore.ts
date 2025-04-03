import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WeatherInfo {
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy";
  temperature: number;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: "activity" | "transport" | "food" | "accommodation";
  location?: {
    name: string;
  };
}

export interface DayPlan {
  date: string;
  weather: WeatherInfo;
  events: TimelineEvent[];
}

export interface HotelOption {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  description: string;
  amenities: string[];
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
    duration: "entire_trip" | "per_day";
  };
  travelers: number;
  transportationType: "flight" | "train" | "bus";
  status: "planned" | "ongoing" | "completed";
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
  totalCost: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
    total: number;
  };
  image: string;
  _id?: string; // MongoDB ID
}

interface TripState {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
}

// Sample static trip data
const sampleTrip: Trip = {
  id: "sample-trip-1",
  title: "Paris Adventure",
  destination: "Paris, France",
  startDate: "2024-03-20",
  endDate: "2024-03-25",
  budget: {
    amount: 2500,
    type: "per_person",
    duration: "entire_trip",
  },
  travelers: 2,
  transportationType: "flight",
  status: "planned",
  itinerary: [
    {
      date: "2024-03-20",
      weather: {
        condition: "sunny",
        temperature: 22,
      },
      events: [
        {
          time: "09:00",
          title: "Hotel Check-in",
          description: "Check in at Grand Plaza Hotel",
          type: "accommodation",
        },
        {
          time: "11:00",
          title: "Eiffel Tower Visit",
          description: "Guided tour of the Eiffel Tower",
          type: "activity",
        },
        {
          time: "13:30",
          title: "Lunch at Le Petit Bistro",
          description: "Traditional French cuisine",
          type: "food",
        },
        {
          time: "15:00",
          title: "Seine River Cruise",
          description: "Scenic boat tour along the Seine",
          type: "activity",
        },
        {
          time: "19:00",
          title: "Dinner at L'Abeille",
          description: "Fine dining experience",
          type: "food",
        },
      ],
    },
    {
      date: "2024-03-21",
      weather: {
        condition: "cloudy",
        temperature: 18,
      },
      events: [
        {
          time: "10:00",
          title: "Louvre Museum",
          description: "Art museum tour",
          type: "activity",
        },
        {
          time: "13:00",
          title: "Lunch at Café de Flore",
          description: "Historic café experience",
          type: "food",
        },
        {
          time: "15:00",
          title: "Shopping at Champs-Élysées",
          description: "Luxury shopping experience",
          type: "activity",
        },
        {
          time: "20:00",
          title: "Dinner and Show at Moulin Rouge",
          description: "Cabaret show with dinner",
          type: "food",
        },
      ],
    },
  ],
  weather: [
    {
      condition: "sunny",
      temperature: 22,
    },
    {
      condition: "cloudy",
      temperature: 18,
    },
  ],
  accommodation: [
    {
      id: "hotel-1",
      name: "Grand Plaza Hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      rating: 4.8,
      price: 350,
      description: "Luxury hotel with Eiffel Tower views",
      amenities: ["Free WiFi", "Spa", "Restaurant", "Room Service", "Gym"],
      location: {
        coordinates: [0, 0],
        address: ""
      }
    },
    {
      id: "hotel-2",
      name: "Le Petit Palais",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      rating: 4.5,
      price: 280,
      description: "Boutique hotel in the heart of Paris",
      amenities: ["Free WiFi", "Bar", "Restaurant", "Concierge", "Laundry"],
      location: {
        coordinates: [0, 0],
        address: ""
      }
    },
  ],
  image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
};

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: [sampleTrip], // Initialize with the sample trip
      addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
      updateTrip: (id, updatedTrip) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id ? { ...trip, ...updatedTrip } : trip
          ),
        })),
      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
        })),
    }),
    {
      name: "trip-storage",
    }
  )
);
