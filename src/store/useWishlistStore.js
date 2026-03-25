import { create } from "zustand";

export const useWishlistStore = create((set) => ({
  wishlistItems: [],
  setWishlistItems: (items) => set({ wishlistItems: items }),
}));