import { create } from "zustand";

export const useMovieFilterStore = create((set) => ({
  selectedGenres: [],
  selectedSort: "popularity.desc",
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),
}));