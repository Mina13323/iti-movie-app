import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isAuthenticated: false,
  login: (user) => set({ authUser: user, isAuthenticated: true }),
  logout: () => set({ authUser: null, isAuthenticated: false }),
}));