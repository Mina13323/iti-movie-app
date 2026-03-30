import React, { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function Home() {
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [genresList, setGenresList] = useState([]);

  const { movies, loading, error, totalPages } = useMovies({ 
    page, genre, sortBy, searchQuery 
  });

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setGenresList(data.genres || []));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Professional Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand Name */}
          <h1 className="text-3xl font-black tracking-tighter text-[--color-brand-red] cursor-pointer">
            MOVIEX
          </h1>

          {/* Search & Filters Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder="Search movies..."
                className="w-full bg-[#181818] text-white text-sm py-2 px-4 rounded-full border border-transparent focus:border-[--color-brand-red] outline-none transition-all placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>

            {!searchQuery && (
              <div className="flex gap-2">
                <select 
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-[#181818] text-xs py-2 px-3 rounded-md border border-gray-800 outline-none hover:border-gray-600 transition-colors"
                >
                  <option value="">Genres</option>
                  {genresList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>

                <select 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#181818] text-xs py-2 px-3 rounded-md border border-gray-800 outline-none hover:border-gray-600 transition-colors"
                >
                  <option value="popularity.desc">Trending</option>
                  <option value="vote_average.desc">Top Rated</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 md:p-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-8">
          {loading ? (
            <div className="col-span-full h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[--color-brand-red] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            movies.map(movie => <MovieCard key={movie.id} movie={movie} />)
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-16 pb-10">
            <button 
              disabled={page === 1}
              onClick={() => { setPage(p => p - 1); window.scrollTo(0,0); }}
              className="text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
            >
              ← Back
            </button>
            <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">
              Page {page} / {totalPages}
            </span>
            <button 
              disabled={page === totalPages}
              onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
              className="text-white hover:text-[--color-brand-red] font-bold transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}