import { useState, useEffect } from "react";
import { useMovies } from "./useMovies";
import { MovieCard } from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Search() {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const { movies, loading, error } = useMovies({ query: debouncedQuery });

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Search movies..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 border rounded mb-6"
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))
          : movies.length > 0
          ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          : debouncedQuery && <p>No results found</p>
        }
      </div>
    </div>
  );
}