import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getRecommendations, getMovieVideos, toggleFavorite, toggleWatchlist } from "../services/movieService";
import MovieGrid from "../components/movie/MovieGrid";
import MovieCard from "../components/movie/MovieCard";
import TrailerPlayer from "../components/movie/TrailerPlayer";
import { Play, Plus, Check, Info, Star, Clock, Calendar, Cloud } from "lucide-react";
import { useWishlistStore } from "../store/useWishlistStore";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import usePageTitle from "../hooks/usePageTitle";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";

export default function MovieDetailsPage() {
  const { lang } = useLanguage();
  const { id } = useParams();
  
  const movieDetailsTranslations = useMemo(() => ({
    added: { en: "added to My List", ar: "تمت إضافته إلى قائمتي", fr: "ajouté à ma liste", zh: "已添加到我的列表" },
    removed: { en: "removed from My List", ar: "تمت إزالته من قائمتي", fr: "retiré de ma liste", zh: "已从我的列表中移除" },
    watch: { en: "WATCH", ar: "مشاهدة", fr: "REGARDER", zh: "立即观看" },
    addList: { en: "ADD LIST", ar: "إضافة للقائمة", fr: "AJOUTER", zh: "加入列表" },
    myList: { en: "MY LIST", ar: "قائمتي", fr: "MA LISTE", zh: "我的列表" },
    info: { en: "Movie Information", ar: "معلومات الفيلم", fr: "Informations", zh: "电影信息" },
    duration: { en: "Duration", ar: "المدة", fr: "Durée", zh: "时长" },
    release: { en: "Release", ar: "الإصدار", fr: "Sortie", zh: "上映时间" },
    status: { en: "Status", ar: "الحالة", fr: "Statut", zh: "状态" },
    genres: { en: "Genres", ar: "التصنيفات", fr: "Genres", zh: "类型" },
    trailer: { en: "Watch Trailer", ar: "مشاهدة الإعلان", fr: "Bande-annonce", zh: "观看预告片" },
    similar: { en: "You Might Also Like", ar: "قد يعجبك أيضاً", fr: "Vous pourriez aussi aimer", zh: "猜你喜欢" },
    viewAll: { en: "View All", ar: "عرض الكل", fr: "Tout voir", zh: "查看全部" },
    error: { en: "Failed to load movie details.", ar: "فشل تحميل تفاصيل الفيلم.", fr: "Échec du chargement des détails.", zh: "加载电影详情失败。" },
    rating: { en: "Rating", ar: "تقييم", fr: "Note", zh: "评分" }
  }), []);

  const { t } = useTranslation(movieDetailsTranslations);
  const { tmdbSessionId, tmdbAccount } = useAuthStore();
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => 
    state.wishlistItems.some((item) => item.id === parseInt(id))
  );
  
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleWishlistToggle = async () => {
    if (!movie) return;
    
    // Local update
    toggleWishlist(movie);
    
    // TMDb Sync (Bonus)
    if (tmdbSessionId && tmdbAccount) {
      try {
        const newState = !isInWishlist;
        // We sync as both Favorite and Watchlist for maximum coverage on TMDb
        await Promise.all([
          toggleFavorite(tmdbAccount.id, tmdbSessionId, "movie", movie.id, newState),
          toggleWatchlist(tmdbAccount.id, tmdbSessionId, "movie", movie.id, newState)
        ]);
        
        toast.success(lang === "en" 
          ? `${movie.title} synced with your TMDb account!` 
          : `تم مزامنة ${movie.title} مع حساب TMDb الخاص بك!`, {
            icon: <Cloud className="size-4 text-sky-400" />
          });
      } catch (err) {
        console.error("TMDb Sync Error:", err);
        toast.error(lang === "en" ? "Failed to sync with TMDb account" : "فشل المزامنة مع حساب TMDb");
      }
    } else {
      if (!isInWishlist) {
        toast.success(`${movie.title} ${t("added")}`);
      } else {
        toast.info(`${movie.title} ${t("removed")}`);
      }
    }
  };

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
        setRecommendations(recsRes.data.results?.slice(0, 12) || []);
        
        const videos = videosRes.data.results || [];
        const trailerVideo = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos[0];
        setTrailer(trailerVideo || null);
      })
      .catch((err) => {
        console.error(err);
        setError(t("error"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, lang]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-background min-h-screen">
        <div className="bg-muted p-10 rounded-lg inline-block border border-border shadow-2xl">
          <h2 className="text-3xl font-black mb-4 text-foreground">Oops!</h2>
          <p className="text-muted-foreground mb-8">{error || "We couldn't find that movie."}</p>
          <Link to="/" className="bg-[#E50914] text-white font-bold py-3 px-8 rounded-md hover:bg-[#b20710] transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}` 
    : "";
  
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-[#E50914] selection:text-white transition-colors duration-300">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[85vh] lg:h-[95vh] overflow-hidden">
        {/* Backdrop Image */}
        {backdropUrl && (
          <div className="absolute inset-0">
            <img 
              src={backdropUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
            {/* Multi-stage Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center pt-20 md:pt-32 pb-10 px-4 md:px-16 lg:px-24">
          <div className="max-w-3xl animate-in fade-in slide-in-from-left-10 duration-1000">
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm font-bold text-[#46d369] mb-4">
              <span className="bg-foreground/10 text-foreground px-2 py-0.5 rounded text-[10px] uppercase tracking-widest border border-foreground/20">Original</span>
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-current" />
                <span>{movie.vote_average.toFixed(1)} {t("rating")}</span>
              </div>
              <span className="text-muted-foreground font-medium">|</span>
              <span className="text-muted-foreground font-medium">{releaseYear}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black text-foreground leading-none tracking-tighter mb-4 uppercase drop-shadow-lg">
              {movie.title}
            </h1>
            
            {/* Tagline Secondary */}
            <p className="text-sm md:text-2xl font-black text-foreground/80 mb-6 tracking-[0.2em] uppercase">
               {movie.tagline || movie.genres?.[0]?.name || "Cinematic Experience"}
            </p>
            
            {/* Description */}
            <p className="text-foreground/90 text-base md:text-lg lg:text-xl leading-relaxed mb-10 line-clamp-3 md:line-clamp-none max-w-2xl font-medium drop-shadow-md">
              {movie.overview}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
               <button className="flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 font-bold py-3 px-8 rounded-md transition-all scale-100 active:scale-95 shadow-xl">
                 <Play className="size-6 fill-black" />
                 <span>{t("watch")}</span>
               </button>
               <button 
                 onClick={handleWishlistToggle}
                 className={`flex items-center justify-center gap-3 backdrop-blur-md text-white font-bold py-3 px-8 rounded-md transition-all scale-100 active:scale-95 border border-transparent ${
                   isInWishlist ? "bg-[#E50914] hover:bg-[#b20710]" : "bg-[#5a5a5a]/60 hover:bg-[#5a5a5a]/80"
                 }`}
               >
                 {isInWishlist ? <Check className="size-6" /> : <Plus className="size-6" />}
                 <span>{isInWishlist ? t("myList") : t("addList")}</span>
               </button>
               
               {tmdbSessionId && (
                 <div className="flex items-center gap-2 text-[10px] font-black text-sky-400/80 uppercase tracking-widest mt-1 ml-1 self-start sm:self-center">
                    <Cloud className="size-3" />
                    {lang === "en" ? "Cloud Sync Active" : "المزامنة السحابية نشطة"}
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Details & Video Player Section */}
      <section className="px-4 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column: Info */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="text-[#E50914] text-xs font-black tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <Info className="size-4" />
                {t("info")}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground font-bold text-sm uppercase px-1">{t("duration")}</span>
                  <span className="text-foreground font-bold flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    {movie.runtime} min
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground font-bold text-sm uppercase px-1">{t("release")}</span>
                  <span className="text-foreground font-bold flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    {movie.release_date}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground font-bold text-sm uppercase px-1">{t("status")}</span>
                  <span className="text-[#46d369] font-bold">{movie.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[#E50914] text-xs font-black tracking-[0.3em] uppercase mb-4">{t("genres")}</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="bg-muted text-foreground border border-border px-4 py-2 rounded-full text-xs font-bold hover:bg-muted-foreground/10 transition-colors cursor-default">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Video Trailer Player */}
          <div className="lg:col-span-2">
            <h3 className="text-foreground text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#E50914]"></span>
              {t("trailer")}
            </h3>
            
            <TrailerPlayer trailer={trailer} title={movie.title} />
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="px-4 md:px-16 lg:px-24 py-16 bg-gradient-to-b from-transparent to-muted/20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-4">
            <span className="w-10 h-0.5 bg-[#E50914]"></span>
            {t("similar")}
          </h2>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-bold text-sm tracking-widest uppercase">
            {t("viewAll")}
          </Link>
        </div>
        
        <MovieGrid>
          {recommendations.map(rec => (
            <MovieCard key={rec.id} movie={rec} />
          ))}
        </MovieGrid>
      </section>
    </div>
  );
}