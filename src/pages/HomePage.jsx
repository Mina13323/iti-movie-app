import { useEffect, useState, useMemo } from "react";
import { getNowPlaying } from "../services/movieService";
import MovieGrid from "../components/movie/MovieGrid";
import MovieCard from "../components/movie/MovieCard";
import MovieSkeleton from "../components/movie/MovieSkeleton";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import { Clapperboard } from "lucide-react";

export default function HomePage() {
  const { lang } = useLanguage();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const homePageTranslations = useMemo(() => ({
    trendsTitle: { en: "Trends Now", ar: "الآن الرائجة", fr: "Tendances", zh: "当前趋势" },
    popular: { en: "Popular", ar: "شائع", fr: "Populaire", zh: "热门" },
    newest: { en: "Newest", ar: "الأحدث", fr: "Nouveau", zh: "最新" },
    topRated: { en: "Top Rated", ar: "الأعلى تقييماً", fr: "Mieux notés", zh: "评分最高" },
    originalsTitle: { en: "Original Movies", ar: "أفلام أصلية", fr: "Films Originaux", zh: "原创电影" },
    searchAll: { en: "Search All →", ar: "بحث في الكل ←", fr: "Tout rechercher →", zh: "搜索全部 →" },
    tryAgain: { en: "Try Again", ar: "إعادة المحاولة", fr: "Réessayer", zh: "重试" },
    error: { en: "Failed to load movies. Please check your API key.", ar: "فشل تحميل الأفلام. يرجى التحقق من مفتاح API.", fr: "Échec du chargement.", zh: "加载失败。" }
  }), []);

  const { t } = useTranslation(homePageTranslations);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getNowPlaying()
      .then((res) => {
        setMovies(res.data.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError(t("error"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lang, t]);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Clapperboard className="size-16 text-muted-foreground/20 mb-6" />
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#E50914] text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-xs"
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Dynamic Header Section (Like "Trends Now" in image) */}
      <section className="px-4 md:px-12 pt-28 pb-6">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-3 transition-colors">
             <span className="w-1.5 h-8 bg-[#E50914] rounded-full"></span>
             {t("trendsTitle")}
          </h2>
          {/* Category Tabs like in image (Static for UI) */}
          <div className="hidden md:flex items-center gap-4 pl-6 border-l border-border">
             <span className="text-xs font-black text-[#E50914] cursor-pointer hover:underline uppercase tracking-widest">{t("popular")}</span>
             <span className="text-xs font-black text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase tracking-widest">{t("newest")}</span>
             <span className="text-xs font-black text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase tracking-widest">{t("topRated")}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <MovieSkeleton key={i} />
            ))}
          </div>
        ) : (
          <MovieGrid>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MovieGrid>
        )}
      </section>

      {/* Another Section (Movies Original) */}
      <section className="px-4 md:px-12 py-10 bg-gradient-to-t from-muted/5 to-transparent">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-3 transition-colors">
             <span className="w-1.5 h-8 bg-muted-foreground/30 rounded-full"></span>
             {t("originalsTitle")}
          </h2>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-[#E50914] cursor-pointer transition-colors">{t("searchAll")}</span>
        </div>
        
        {/* Reuse the same grid for now or fetch different data if needed */}
        {!isLoading && (
          <MovieGrid>
            {movies.slice(0, 6).reverse().map((movie) => (
              <MovieCard key={movie.id + '-rev'} movie={movie} />
            ))}
          </MovieGrid>
        )}
      </section>
    </div>
  );
}