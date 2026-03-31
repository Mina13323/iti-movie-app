import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getPopularMovies, discoverMovies } from "../services/movieService";
import MovieGrid from "../components/movie/MovieGrid";
import MovieCard from "../components/movie/MovieCard";
import MovieSkeleton from "../components/movie/MovieSkeleton";
import MovieFilters from "../components/movie/MovieFilters";
import PaginationBar from "../components/movie/PaginationBar";
import { useLanguage } from "../context/LanguageContext";
import usePageTitle from "../hooks/usePageTitle";
import { useTranslation } from "../hooks/useTranslation";

export default function MoviesPage() {
  const moviesPageTranslations = useMemo(() => ({
    title: { en: "Movies", ar: "الأفلام", fr: "Films", zh: "电影" },
    pageTitle: { en: "Explore Popular Movies", ar: "استكشاف الأفلام الشعبية", fr: "Explorer les Films", zh: "探索热门电影" },
    description: { 
      en: "Discover the most popular movies trending right now. From blockbusters to indie gems, find your next favorite film.", 
      ar: "اكتشف الأفلام الأكثر شعبية الرائجة الآن. من الأفلام الضخمة إلى الجواهر المستقلة، اعثر على فيلمك المفضل التالي.", 
      fr: "Découvrez les films les plus populaires du moment.",
      zh: "探索当前最受欢迎的热门电影。"
    },
    tryAgain: { en: "Try Again", ar: "إعادة المحاولة", fr: "Réessayer", zh: "重试" },
    error: { en: "Failed to load movies. Please check your connection.", ar: "فشل تحميل الأفلام. يرجى التحقق من الاتصال.", fr: "Échec du chargement.", zh: "加载失败。" }
  }), []);

  const { t, lang } = useTranslation(moviesPageTranslations);
  usePageTitle(t("pageTitle"));
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL-driven state
  const page = parseInt(searchParams.get("page") || "1");
  const genre = searchParams.get("genre") || null;
  const sort = searchParams.get("sort") || "popularity.desc";

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = () => {
    setIsLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    const params = {
      page,
      sort_by: sort,
      with_genres: genre,
    };

    discoverMovies(params)
      .then((res) => {
        setMovies(res.data.results || []);
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
    fetchMovies();
  }, [lang, page, genre, sort]);

  const handleGenreChange = (newGenre) => {
    setSearchParams({ 
      page: "1", // Reset to page 1 on filter
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
            onClick={fetchMovies}
            className="bg-[#E50914] text-white px-8 py-3 rounded font-black uppercase tracking-widest hover:bg-[#f40612] transition-colors"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <MovieGrid>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
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
