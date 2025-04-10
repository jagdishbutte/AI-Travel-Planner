import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tripsAPI } from "../lib/apis";
import { useAuthStore } from "../store/authStore";

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
  _id?: string; 
}

// const userId = useAuthStore.getState().user?.id;

// const fetchTrips = async (userId: string) => {
//   try {
//     const res = await tripsAPI.getAllTrips(userId);
//     const trips = res.data.data; // Assuming response structure is { data: { success: true, data: [Trip] } }
//     set({ trips });
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//   }
// }


interface TripState {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  fetchTrips: () => void;
  resetTrips: () => void;
}


export const useTripStore = create<TripState>()(
    persist(
        (set) => ({
            trips: [],
            addTrip: (trip: Trip) =>
                set((state: any) => ({ trips: [...state.trips, trip] })),
            updateTrip: (id: string, updatedTrip: any) =>
                set((state: any) => ({
                    trips: state.trips.map((trip: Trip) =>
                        trip.id === id ? { ...trip, ...updatedTrip } : trip
                    ),
                })),
            deleteTrip: async (id: string) => {
                try {
                    await tripsAPI.deleteTrip(id); 
                    set((state: any) => {
                        const updatedTrips = state.trips.filter(
                            (trip: Trip) => trip.id !== id
                        );
                        return { trips: updatedTrips };
                    });
                } catch (error) {
                    console.error("Failed to delete trip:", error);
                }
            },

            fetchTrips: async () => {
                const userId = useAuthStore.getState().user?.id;
                if (!userId) return;

                try {
                    const res: any = await tripsAPI.getAllTrips(userId);
                    const trips = res.data?.map((trip: any) => ({
                        ...trip,
                    }));
                    set({ trips });
                } catch (error) {
                    console.error("Error fetching trips:", error);
                }
            },
            resetTrips: () => set({ trips: [] }),
        }),
        {
            name: "trip-storage",
        }
    )
);
