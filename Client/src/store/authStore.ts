import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, token: string, userId: string) => Promise<void>;
  signUp: (email: string, token: string, userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboardingComplete: (completed: boolean) => void;
  updateUserPreferences: (preferences: User["preferences"]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      hasCompletedOnboarding: false,

      signIn: async (email: string, token: string, userId: string) => {
        set({ isLoading: true });
        try {
          set({
            user: {
              id: userId,
              email,
              token,
              preferences: null,
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (email: string, token: string, userId: string) => {
        set({ isLoading: true });
        try {
          set({
            user: {
              id: userId,
              email,
              token,
              preferences: null,
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
    }),
    {
      name: "auth-storage",
    }
  )
);
