import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";

const initialUser = authService.getCurrentUser();

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: initialUser,
      isAuthenticated: !!initialUser,
      isLoading: false,
      error: null,
      
      // TMDb Auth State
      tmdbSessionId: null,
      tmdbAccount: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          set({ authUser: response.user, isAuthenticated: true, isLoading: false });
          return response.user;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          set({ isLoading: false });
          return response;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        await authService.logout();
        set({ authUser: null, isAuthenticated: false, tmdbSessionId: null, tmdbAccount: null });
      },

      setAuthUser: (user) => set({ authUser: user, isAuthenticated: !!user }),

      // TMDb Specific Actions
      setTmdbSession: (sessionId, account) => set({ tmdbSessionId: sessionId, tmdbAccount: account }),
      tmdbLogout: () => set({ tmdbSessionId: null, tmdbAccount: null }),
    }),
    {
      name: "auth-storage", // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);