import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getPopularTV, discoverTV } from "../services/movieService";
import MovieGrid from "../components/movie/MovieGrid";
import MovieCard from "../components/movie/MovieCard";
import MovieSkeleton from "../components/movie/MovieSkeleton";
import MovieFilters from "../components/movie/MovieFilters";
import PaginationBar from "../components/movie/PaginationBar";
import { useLanguage } from "../context/LanguageContext";
import usePageTitle from "../hooks/usePageTitle";
import { useTranslation } from "../hooks/useTranslation";

export default function SeriesPage() {
  const seriesPageTranslations = useMemo(() => ({
    title: { en: "TV Series", ar: "المسلسلات", fr: "Séries", zh: "剧集" },
    pageTitle: { en: "Explore TV Series", ar: "استكشاف المسلسلات", fr: "Explorer les Séries", zh: "探索剧集" },
    description: { 
      en: "Binge-worthy shows you'll love. Discover the most popular TV series around the world from drama to comedy.", 
      ar: "مسلسلات تستحق المشاهدة ستحبها. اكتشف أشهر مسلسلات التلفزيون في العالم من الدراما إلى الكوميديا.", 
      fr: "Des séries incontournables que vous allez adorer.",
      zh: "值得追的精彩剧集。探索全球最受欢迎的热门剧。"
    },
    tryAgain: { en: "Try Again", ar: "إعادة المحاولة", fr: "Réessayer", zh: "重试" },
    error: { en: "Failed to load series. Please check your connection.", ar: "فشل تحميل المسلسلات. يرجى التحقق من الاتصال.", fr: "Échec du chargement.", zh: "加载失败。" }
  }), []);

  const { t, lang } = useTranslation(seriesPageTranslations);
  usePageTitle(t("pageTitle"));
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven state
  const page = parseInt(searchParams.get("page") || "1");
  const genre = searchParams.get("genre") || null;
  const sort = searchParams.get("sort") || "popularity.desc";

  const [series, setSeries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeries = () => {
    setIsLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    const params = {
      page,
      sort_by: sort,
      with_genres: genre,
    };

    discoverTV(params)
      .then((res) => {
        setSeries(res.data.results || []);
        setTotalPages(res.data.total_pages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError(t("error"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSeries();
  }, [lang, page, genre, sort]);

  const handleGenreChange = (newGenre) => {
    setSearchParams({ 
      page: "1", 
      genre: newGenre || "", 
      sort 
    });
  };

  const handleSortChange = (newSort) => {
    setSearchParams({ 
      page: "1", 
      genre: genre || "", 
      sort: newSort 
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ 
      page: newPage.toString(), 
      genre: genre || "", 
      sort 
    });
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-12 bg-background min-h-screen text-foreground transition-colors duration-300">
      <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase flex items-center gap-4">
          <span className="w-2 h-10 bg-[#E50914] rounded-full"></span>
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
          {t("description")}
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-12">
        <MovieFilters
          type="tv"
          selectedGenre={genre ? parseInt(genre) : null}
          onGenreSelect={handleGenreChange}
          selectedSort={sort}
          onSortSelect={handleSortChange}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <MovieSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-red-500 font-bold text-xl mb-6">{error}</p>
          <button 
            onClick={fetchSeries}
            className="bg-[#E50914] text-white px-8 py-3 rounded font-black uppercase tracking-widest hover:bg-[#f40612] transition-colors"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <MovieGrid>
            {series.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </MovieGrid>

          <PaginationBar
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
