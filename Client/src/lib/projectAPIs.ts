import { apiConnector } from "./apiConnector";
import { AxiosResponse } from "axios";

// Types
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

export interface PreferencesRequest {
  userId: string;
  [key: string]: any; // For dynamic preferences
}

// Authentication APIs
export const authAPI = {
  login: async (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> => {
    return apiConnector("POST", "/users/userLogin", data, null, null, null);
  },

  register: async (
    data: RegisterRequest
  ): Promise<AxiosResponse<AuthResponse>> => {
    return apiConnector("POST", "/users/userRegister", data, null, null, null);
  },
};

// Preferences APIs
export const preferencesAPI = {
  savePreferences: async (data: PreferencesRequest): Promise<AxiosResponse> => {
    return apiConnector("POST", "/preferences/save", data, null, null, null);
  },
};
