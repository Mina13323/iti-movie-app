import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import WishlistButton from "./WishlistButton";
import { useAuthGuard } from "../../context/AuthGuardContext";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  // Use a fallback image if no poster
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "https://via.placeholder.com/500x750?text=No+Image";

  // Handle both Movie (title, release_date) and Series (name, first_air_date)
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date || "N/A";
  const year = releaseDate !== "N/A" ? releaseDate.split("-")[0] : "N/A";
  
  // Decide route based on presence of title (movie) or name (series)
  // Or better, check the media_type if available, otherwise guess
  const isSeries = !!movie.name && !movie.title;
  const detailPath = isSeries ? `/series/${movie.id}` : `/movie/${movie.id}`;

  const { ensureAuthenticated } = useAuthGuard();
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    e.preventDefault();
    ensureAuthenticated(() => {
      navigate(detailPath);
    });
  };

  return (
    <div className="group relative flex flex-col rounded-md transition-all duration-300 hover:scale-[1.08] hover:z-20 focus-within:outline-none">
      {/* Poster with Gradient Bottom overlay */}
      <div 
        onClick={handleCardClick}
        className="aspect-[2/3] w-full relative overflow-hidden rounded-md shadow-lg transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] cursor-pointer"
      >
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Wishlist Button Overlay */}
        <div className="absolute top-2 right-2 transition-all duration-300 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-30">
          <WishlistButton movie={movie} />
        </div>
      </div>
      
      {/* Movie Details below info */}
      <div onClick={handleCardClick} className="mt-3 space-y-1 block hover:no-underline cursor-pointer">
        <h3 className="text-foreground font-bold text-xs md:text-sm line-clamp-1 leading-tight group-hover:text-[#E50914] transition-colors uppercase tracking-wide">
          {title}
        </h3>
        
        <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-medium pt-0.5">
          <span className="text-foreground">{year}</span>
          
          {movie.vote_average > 0 && (
            <div className="flex items-center gap-1 text-[#46d369]">
              <Star className="size-2.5 fill-current" />
              <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
