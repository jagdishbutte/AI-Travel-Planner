import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserPreferences } from "../types";
// import { useNavigate } from "react-router-dom";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  userPreferences: UserPreferences;
  signIn: (
    email: string,
    token: string,
    userId: string,
    preferences: UserPreferences,
    role: "user" | "admin"
  ) => Promise<void>;
  signUp: (
    email: string,
    token: string,
    userId: string,
    role: "user" | "admin"
  ) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboardingComplete: (completed: boolean) => void;
  updateUserPreferences: (preferences: User["preferences"]) => void;
  updateUser: (userData: User) => void;
}
// const navigate = useNavigate();
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      hasCompletedOnboarding: false,
      userPreferences: {} as UserPreferences,

      signIn: async (
        email: string,
        token: string,
        userId: string,
        preferences: UserPreferences,
        role: "user" | "admin"
      ) => {
        set({ isLoading: true });
        set({ userPreferences: preferences });
        try {
          set({
            user: {
              id: userId,
              email,
              token,
              role,
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (
        email: string,
        token: string,
        userId: string,
        role: "user" | "admin"
      ) => {
        set({ isLoading: true });
        try {
          set({
            user: {
              id: userId,
              email,
              token,
              role,
            },
            hasCompletedOnboarding: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        set({ user: null, hasCompletedOnboarding: false });
      },

      setOnboardingComplete: (completed: boolean) => {
        set({ hasCompletedOnboarding: completed });
      },

      updateUserPreferences: (preferences) => {
        set((state) => ({
          user: state.user ? { ...state.user, preferences } : null,
        }));
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
