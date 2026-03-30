import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="relative group cursor-pointer bg-[#111] rounded-md overflow-hidden transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:z-10">
      
      {/* Image with subtle zoom on hover */}
      <img 
        src={posterPath} 
        alt={movie.title}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Heart Button - Fast & Responsive */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-3 right-3 z-30 p-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80"
      >
        <Heart 
          size={16} 
          className={`transition-all duration-300 ${isFavorite ? 'fill-[#E50914] text-[#E50914] scale-125' : 'text-white'}`} 
        />
      </button>

      {/* Info Overlay - Faster Transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-sm font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          <span className="text-[#E50914] text-xs font-black px-1.5 py-0.5 border border-[#E50914] rounded">
             {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-gray-300 text-[10px] font-medium">
            {movie.release_date?.split('-')[0]}
          </span>
        </div>
      </div>
    </div>
  );
}