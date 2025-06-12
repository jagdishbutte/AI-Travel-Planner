import { apiConnector } from "./apiConnector";
import { AxiosResponse } from "axios";
import { auth, preferences, trips, admin } from "./apis";
import { VITE_API_BASE_URL } from "./apiConnections";
import { User } from "../types";

// Common Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userId: string;
  token: string;
  preferences: UserPreferences;
  role: "user" | "admin";
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  mobile: string;
  location: string;
  age: string;
  nationality: string;
  occupation: string;
  passportNumber: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  userId: string;
  role: "user" | "admin";
}

// User Preferences Types
export interface UserPreferences {
  travelStyle: string[];
  destinations: string[];
  accommodation: string[];
  transportation: string[];
  activities: string[];
  budget: string[];
  tripLength: string[];
}

export interface PreferencesRequest extends UserPreferences {
  userId: string;
}

// Trip Types
export interface TripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: {
    amount: number;
    type: "per_person" | "total";
  };
  travelers: number;
  transportationType: string;
}

export interface Trip extends TripRequest {
  id: string;
  title: string;
  status: "planned" | "ongoing" | "completed";
  itinerary: any[];
  weather: any[];
  accommodation: any[];
  image: string;
}

interface GenerateTripRequest {
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
}

// interface TripPlan {
//   // ... your trip plan interface
// }

// API Services
export const authAPI = {
  login: async (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
    return apiConnector("POST", auth.LOGIN, data, null, null, null);
  },

  register: async (
    data: RegisterRequest
  ): Promise<AxiosResponse<RegisterResponse>> => {
    return apiConnector("POST", auth.REGISTER, data, null, null, null);
  },
};

export const preferencesAPI = {
  savePreferences: async (
    data: PreferencesRequest
  ): Promise<AxiosResponse<ApiResponse<UserPreferences>>> => {
    return apiConnector("POST", preferences.SAVE, data, null, null, null);
  },

  getPreferences: async (
    userId: string
  ): Promise<AxiosResponse<ApiResponse<UserPreferences>>> => {
    return apiConnector("GET", preferences.GET, null, null, { userId }, null);
  },
};

export const tripsAPI = {
  createTrip: async (
    data: TripRequest
  ): Promise<AxiosResponse<ApiResponse<Trip>>> => {
    return apiConnector("POST", trips.CREATE, data, null, null, null);
  },

  // getAllTrips: async (
  //   userId: string
  // ): Promise<AxiosResponse<ApiResponse<Trip[]>>> => {
  //   return apiConnector("GET", trips.GET_ALL, null, null, { userId }, null);
  // },

  // getTrip: async (id: string): Promise<AxiosResponse<ApiResponse<Trip>>> => {
  //   return apiConnector("GET", trips.GET_ONE(id), null, null, null, null);
  // },

  // updateTrip: async (
  //   id: string,
  //   data: Partial<Trip>
  // ): Promise<AxiosResponse<ApiResponse<Trip>>> => {
  //   return apiConnector("PUT", trips.UPDATE(id), data, null, null, null);
  // },

  // deleteTrip: async (id: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  //   return apiConnector("DELETE", trips.DELETE(id), null, null, null, null);
  // },

  generateAITrip: (data: GenerateTripRequest) => {
    return apiConnector(
      "POST",
      `${VITE_API_BASE_URL}/plan/generate`,
      data,
      null,
      null,
      null
    );
  },
};

export const tripAPI = {
  generateAITrip: (data: GenerateTripRequest) => {
    return apiConnector(
      "POST",
      `${VITE_API_BASE_URL}/plan/generate`,
      data,
      null,
      null,
      null
    );
  },
};

export const adminAPI = {
  getAllUsers: async (): Promise<AxiosResponse<ApiResponse<User[]>>> => {
    return apiConnector("GET", admin.GET_ALL_USERS, null, null, null, null);
  },
  getUserById: async (
    userId: string
  ): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiConnector(
      "GET",
      `${admin.GET_USER_BY_ID}/${userId}`,
      null,
      null,
      null,
      null
    );
  },
  deleteUser: async (userId: string): Promise<AxiosResponse<ApiResponse>> => {
    return apiConnector(
      "DELETE",
      `${admin.DELETE_USER}/${userId}`,
      null,
      null,
      null,
      null
    );
  },
};
