import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],
      
      toggleWishlist: (movie) => {
        const { wishlistItems } = get();
        const exists = wishlistItems.some((item) => item.id === movie.id);
        
        if (exists) {
          set({ wishlistItems: wishlistItems.filter((item) => item.id !== movie.id) });
        } else {
          set({ wishlistItems: [...wishlistItems, movie] });
        }
      },
      
      removeFromWishlist: (movieId) => {
        const { wishlistItems } = get();
        set({ wishlistItems: wishlistItems.filter((item) => item.id !== movieId) });
      },
      
      isInWishlist: (movieId) => {
        return get().wishlistItems.some((item) => item.id === movieId);
      },
    }),
    {
      name: "movie-wishlist",
    }
  )
);