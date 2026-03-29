import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/movieService";
import MovieGrid from "../components/movie/MovieGrid";
import MovieCard from "../components/movie/MovieCard";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ query: searchInput.trim() });
      setQuery(searchInput.trim());
    }
  };

  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setSearchInput(currentQuery);
    setQuery(currentQuery);
  }, [searchParams]);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    searchMovies(query)
      .then((res) => {
        setMovies(res.data.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch search results. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-indigo-500 mb-6 tracking-tight">
          Explore Movies
        </h1>
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for movies by name..."
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-full py-4 pl-6 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-lg"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors shadow-md"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg text-center border border-red-800 max-w-2xl mx-auto">
          {error}
        </div>
      ) : movies.length === 0 && query ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-inner max-w-3xl mx-auto">
          <div className="text-gray-600 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="9" y1="9" x2="13" y2="13"></line><line x1="13" y1="9" x2="9" y2="13"></line></svg>
          </div>
          <p className="text-gray-300 text-xl font-medium">No movies found matching "{query}".</p>
          <p className="text-gray-500 mt-2">Try adjusting your keywords or searching for something else.</p>
        </div>
      ) : !query ? (
         <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed max-w-3xl mx-auto">
          <p className="text-gray-400 text-lg">Enter a search term above to find movies.</p>
        </div>
      ) : (
        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}
    </div>
  );
}