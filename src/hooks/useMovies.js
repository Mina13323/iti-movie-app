import { useEffect, useState, useMemo } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const useMovies = ({ page = 1, genre = "", sortBy = "popularity.desc", query = "" }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const endpoint = useMemo(() => {
    if (query) {
      return `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
    }

    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;

    if (genre) {
      url += `&with_genres=${genre}`;
    }

    return url;
  }, [page, genre, sortBy, query]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();

        setMovies(data.results || []);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint]);

  return { movies, loading, error, totalPages };
};