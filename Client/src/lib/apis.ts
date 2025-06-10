import { apiConnector } from "./apiConnector";
import { AxiosResponse } from "axios";
import { VITE_API_BASE_URL } from "./apiConnections";
// import { User } from "../types";

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

export interface AuthResponse {
  token: string;
  userId: string;
  message: string;
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

// Trip Types are now imported from ../types

// API Endpoints Configuration
export const auth = {
  LOGIN: `${VITE_API_BASE_URL}/users/userLogin`,
  REGISTER: `${VITE_API_BASE_URL}/users/userRegister`,
};

export const preferences = {
  SAVE: `${VITE_API_BASE_URL}/preferences/save`,
  GET: `${VITE_API_BASE_URL}/preferences/get`,
};

export const trips = {
  CREATE: `${VITE_API_BASE_URL}/api/trips/create`,
  GET_TRIPS: `${VITE_API_BASE_URL}/trips/fetchTrips`,
  GET_ONE: `${VITE_API_BASE_URL}/trips/getTrip`,
  UPDATE: `${VITE_API_BASE_URL}/plan/updateTrip`,
  DELETE: `${VITE_API_BASE_URL}/trips/deleteTrip`,
};

export const admin = {
  GET_ALL_USERS: `${VITE_API_BASE_URL}/users/users`,
  DELETE_USER: `${VITE_API_BASE_URL}/users/users`,
};

// API Services
export const authAPI = {
  login: async (
    data: LoginRequest
  ): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => {
    return apiConnector("POST", auth.LOGIN, data, null, null, null);
  },

  register: async (
    data: RegisterRequest
  ): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => {
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

  getAllTrips: async (userId: string): Promise<ApiResponse<Trip[]>> => {
    return apiConnector("GET", trips.GET_TRIPS, null, null, { userId }, null);
  },

  getTrip: async (tripId: string): Promise<Trip> => {
    const response = await apiConnector(
      "GET",
      trips.GET_ONE,
      null,
      null,
      { tripId },
      null
    );
    return response.data as Trip;
  },

  updateTrip: async (
    tripId: string,
    data: any
  ): Promise<AxiosResponse<ApiResponse<Trip>>> => {
    return apiConnector("PUT", trips.UPDATE, data, null, { tripId }, null);
  },

  deleteTrip: async (
    tripId: string
  ): Promise<AxiosResponse<ApiResponse<void>>> => {
    return apiConnector("DELETE", trips.DELETE, null, null, { tripId }, null);
  },
};
