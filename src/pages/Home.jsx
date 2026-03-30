import React, { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovies";
import MovieCard from "../components/MovieCard"; // Removed braces
import { Skeleton } from "../components/ui/skeleton"; // Direct path

// Temporary Key directly for testing (Replace with your actual key)
const API_KEY = "PASTE_YOUR_TMDB_KEY_HERE"; 

export default function Home() {
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [genresList, setGenresList] = useState([]);

  // Assuming useMovies returns an object with these properties
  const { movies = [], loading, error, totalPages = 1 } = useMovies({ page, genre, sortBy });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        const data = await res.json();
        if (data.genres) {
          setGenresList(data.genres);
        }
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };

    if (API_KEY !== "PASTE_YOUR_TMDB_KEY_HERE") {
        fetchGenres();
    }
  }, []);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select 
          onChange={(e) => setGenre(e.target.value)} 
          className="p-2 bg-slate-900 border border-slate-700 rounded-md outline-none focus:border-blue-500"
        >
          <option value="">All Genres</option>
          {genresList.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select 
          onChange={(e) => setSortBy(e.target.value)} 
          className="p-2 bg-slate-900 border border-slate-700 rounded-md outline-none focus:border-blue-500"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Top Rated</option>
          <option value="release_date.desc">Newest</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 mb-6 bg-red-900/20 border border-red-900 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl bg-slate-800 animate-pulse" />
            ))
          : movies && movies.length > 0
          ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          : !loading && <p className="col-span-full text-center text-slate-500">No movies found.</p>
        }
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-12 pb-10">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
        >
          Previous
        </button>

        <span className="font-medium">
          Page <span className="text-blue-500">{page}</span> of {totalPages}
        </span>

        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}