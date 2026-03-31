import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getRecommendations, getMovieVideos } from "../services/movieService";
import MovieGrid from "../components/movie/MovieGrid";
import MovieCard from "../components/movie/MovieCard";

export default function MovieDetailsPage() {
  const { id } = useParams();
  
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    Promise.all([
      getMovieDetails(id),
      getRecommendations(id),
      getMovieVideos(id)
    ])
      .then(([detailsRes, recsRes, videosRes]) => {
        setMovie(detailsRes.data);
        setRecommendations(recsRes.data.results?.slice(0, 10) || []);
        
        const videos = videosRes.data.results || [];
        const trailerVideo = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
        setTrailer(trailerVideo || null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load movie details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-400 bg-red-900/20 p-8 rounded-xl border border-red-800 inline-block shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error || "Movie not found"}</p>
          <Link to="/" className="mt-6 inline-block text-indigo-400 hover:text-indigo-300 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : "";
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "https://via.placeholder.com/500x750?text=No+Image";

  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";

  return (
    <div className="pb-16 -mt-[73px]">
      {/* Hero Section */}
      <div className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center pt-[73px]">
        {/* Backdrop Image */}
        {backdropUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={backdropUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent"></div>
          </div>
        )}
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 py-12">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            {/* Poster */}
            <div className="w-64 md:w-80 flex-shrink-0 animate-fade-in-up">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="w-full rounded-2xl shadow-2xl border border-gray-700/50"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left animate-fade-in-up animation-delay-100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                {movie.title} <span className="text-gray-400 font-normal">({releaseYear})</span>
              </h1>
              
              {movie.tagline && (
                <p className="text-xl text-indigo-300 italic mt-3 font-light">
                  "{movie.tagline}"
                </p>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-sm font-medium">
                {/* Rating */}
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-500/30">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                     {movie.vote_average.toFixed(1)}
                  </div>
                )}
                
                {/* Runtime */}
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1.5 bg-gray-900/50 backdrop-blur-sm text-gray-300 px-3 py-1.5 rounded-full border border-gray-700">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                     {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                )}
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map(genre => (
                    <span key={genre.id} className="bg-indigo-900/30 backdrop-blur-sm text-indigo-300 border border-indigo-700/50 px-3 py-1.5 rounded-full">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 max-w-3xl">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                  Overview
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
                 {trailer && (
                   <a 
                     href={`https://www.youtube.com/watch?v=${trailer.key}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center gap-2"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                     Watch Trailer
                   </a>
                 )}
                 <button className="bg-gray-800/80 hover:bg-gray-700 backdrop-blur-md text-white font-bold py-3 px-8 rounded-full transition-all border border-gray-600 hover:-translate-y-1 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                   Add to Wishlist
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="container mx-auto px-4 mt-16 relative z-10">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <h2 className="text-3xl font-black text-indigo-500 tracking-tight">
              You Might Also <span>Like</span>
            </h2>
          </div>
          <MovieGrid>
            {recommendations.map(rec => (
              <MovieCard key={rec.id} movie={rec} />
            ))}
          </MovieGrid>
        </div>
      )}
    </div>
  );
}