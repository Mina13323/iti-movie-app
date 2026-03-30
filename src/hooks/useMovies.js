import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const useMovies = ({ page, genre, sortBy, searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const endpoint = searchQuery 
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`
          : `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&sort_by=${sortBy}&page=${page}`;

        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        }
      } catch (err) {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMovies, searchQuery ? 500 : 0);
    return () => clearTimeout(timeoutId);

  }, [page, genre, sortBy, searchQuery]);

  return { movies, loading, error, totalPages };
};