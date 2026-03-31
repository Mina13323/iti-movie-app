import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/movieService";
import MovieCard from "../components/movie/MovieCard";
import MovieGrid from "../components/movie/MovieGrid";
import MovieSkeleton from "../components/movie/MovieSkeleton";
import { Search, X, Clapperboard } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

export default function SearchResultsPage() {
  const { lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
       if (searchInput.trim()) {
         setSearchParams({ query: searchInput.trim() });
       } else {
         setSearchParams({});
         setMovies([]);
       }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  const searchPageTranslations = useMemo(() => ({
    placeholder: { en: "Titles, people, genres...", ar: "العناوين، الأشخاص، التصنيفات...", fr: "Titres, personnes, genres...", zh: "标题，人物，类型..." },
    loading: { en: "Exploring matching titles...", ar: "استكشاف العناوين المطابقة...", fr: "Recherche de titres...", zh: "正在探索匹配的标题..." },
    resultsFor: { en: "Explore Results For:", ar: "استكشاف النتائج لـ:", fr: "Résultats pour :", zh: "探索结果：" },
    noResults: { en: 'No movies found for "{query}"', ar: 'لم يتم العثور على أفلام لـ "{query}"', fr: 'Aucun film trouvé pour "{query}"', zh: '未找到 "{query}" 的电影' },
    tryAnother: { en: "Try searching for another movie or actor.", ar: "جرب البحث عن فيلم آخر أو ممثل.", fr: "Essayez de rechercher un autre film ou acteur.", zh: "尝试搜索其他电影或演员。" },
    typeToStart: { en: "Type to start exploring", ar: "اكتب لبدء الاستكشاف", fr: "Tapez pour commencer à explorer", zh: "输入以开始探索" },
    error: { en: "Failed to find any movies. Please try again.", ar: "فشل العثور على أي أفلام. يرجى المحاولة مرة أخرى.", fr: "Échec de la recherche de films. Veuillez réessayer.", zh: "查找电影失败。请重试。" }
  }), []);
  
  const { t } = useTranslation(searchPageTranslations);

  // Fetch movies when query or language changes
  useEffect(() => {
    const query = searchParams.get("query");
    if (!query) return;

    setIsLoading(true);
    setError(null);
    
    searchMovies(query)
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
  }, [searchParams, lang, t]);

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({});
    setMovies([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12 max-w-7xl">
        
        {/* Sleek Netflix-Style Search Header */}
        <div className="mb-12">
          <div className="relative max-w-4xl mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="size-6 text-muted-foreground group-focus-within:text-[#E50914] transition-colors" />
            </div>
            
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("placeholder")}
              autoFocus
              aria-label={t("placeholder")}
              className="w-full bg-muted/50 hover:bg-muted/80 focus:bg-muted border-none text-foreground rounded-md py-5 pl-14 pr-14 text-xl md:text-2xl font-medium focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all shadow-2xl backdrop-blur-md placeholder:text-muted-foreground"
            />
            
            {searchInput && (
              <button 
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-foreground/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="size-6" />
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="animate-in fade-in duration-500">
             <h2 className="text-muted-foreground font-bold text-sm tracking-widest uppercase mb-8 border-b border-border pb-4 inline-block">
               {t("loading")}
             </h2>
             <MovieGrid>
               {[...Array(8)].map((_, i) => (
                 <MovieSkeleton key={i} />
               ))}
             </MovieGrid>
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-950/20 p-6 rounded-lg text-center border border-red-900/30 max-w-2xl mx-auto">
            {error}
          </div>
        ) : movies.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
             <h2 className="text-muted-foreground font-bold text-sm tracking-widest uppercase mb-8 border-b border-border pb-4 inline-block">
               {t("resultsFor")} <span className="text-foreground ml-2">"{searchInput}"</span>
             </h2>
             <MovieGrid>
               {movies.map((movie) => (
                 <MovieCard key={movie.id} movie={movie} />
               ))}
             </MovieGrid>
          </div>
        ) : searchInput ? (
          <div className="text-center py-32 text-muted-foreground">
            <Clapperboard className="size-20 mx-auto opacity-10 mb-6" />
            <p className="text-xl font-medium text-muted-foreground mb-2">
              {t("noResults", { query: searchInput })}
            </p>
            <p className="text-sm font-normal">
              {t("tryAnother")}
            </p>
          </div>
        ) : (
          <div className="text-center py-40 text-gray-600">
            <Search className="size-24 mx-auto opacity-5 mb-6" />
            <p className="text-lg font-bold tracking-widest uppercase opacity-40">
              {t("typeToStart")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}