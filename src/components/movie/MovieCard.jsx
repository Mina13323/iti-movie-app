import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  // Use a fallback image if no poster
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="group relative flex flex-col rounded-xl overflow-hidden shadow-lg bg-gray-800 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
    >
      <div className="aspect-[2/3] w-full bg-gray-900 relative">
        <img 
          src={imageUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover rounded-t-xl group-hover:opacity-75 transition-opacity duration-300"
          loading="lazy"
        />
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-yellow-500 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
             ★ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs mt-2 font-medium">
          {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
        </p>
      </div>
    </Link>
  );
}
