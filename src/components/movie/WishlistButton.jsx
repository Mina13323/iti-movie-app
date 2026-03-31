import { Heart } from "lucide-react";
import { useWishlistStore } from "../../store/useWishlistStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "../../context/AuthGuardContext";

export default function WishlistButton({ movie, className }) {
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => 
    state.wishlistItems.some((item) => item.id === movie.id)
  );
  const { ensureAuthenticated } = useAuthGuard();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    ensureAuthenticated(() => {
      toggleWishlist(movie);
      
      const title = movie.title || movie.name || "Item";
      
      if (!isInWishlist) {
        toast.success(`${title} added to My List`, {
          style: {
            backgroundColor: '#141414',
            color: '#fff',
            border: '1px solid #333'
          }
        });
      } else {
        toast.info(`${title} removed from My List`, {
          style: {
            backgroundColor: '#141414',
            color: '#fff',
            border: '1px solid #333'
          }
        });
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-full transition-all duration-300 backdrop-blur-sm",
        isInWishlist 
          ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
          : "bg-black/40 text-white hover:bg-black/60 hover:scale-110",
        className
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "size-5 transition-transform duration-300", 
          isInWishlist ? "fill-current scale-110" : "scale-100"
        )} 
      />
    </button>
  );
}
