import { useWishlistStore } from "../store/useWishlistStore";
import MovieCard from "../components/movie/MovieCard";
import MovieGrid from "../components/movie/MovieGrid";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const { lang } = useLanguage();

  const wishlistTranslations = {
    title: { en: "My List", ar: "قائمتي", fr: "Ma liste", zh: "我的列表" },
    items: { en: "Items", ar: "عنصر", fr: "Articles", zh: "项目" },
    emptyTitle: { en: "Your list is empty", ar: "قائمتك فارغة", fr: "Votre liste est vide", zh: "您的列表为空" },
    emptyText: { 
      en: "Don't miss out! Start adding your favorite movies and shows to keep track of what you want to watch next.", 
      ar: "لا تفوت المتعة! ابدأ بإضافة أفلامك وعروضك المفضلة لتتبع ما تريد مشاهدته لاحقاً.", 
      fr: "Ne manquez rien ! Commencez à ajouter vos films et séries préférés pour suivre ce que vous voulez regarder ensuite.", 
      zh: "不要错过精彩内容！开始添加您最喜欢的影视剧，以便日后观看。" 
    },
    explore: { en: "Explore Trending", ar: "اكتشف ما هو رائج", fr: "Explorer les tendances", zh: "探索趋势" }
  };

  const t = (key) => wishlistTranslations[key][lang] || wishlistTranslations[key].en;

  return (
    <div className="pt-32 pb-12 px-4 md:px-12 min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors group">
            <ArrowLeft className="size-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <span className="w-1 h-8 bg-[#E50914] hidden md:block" />
            {t("title")}
            <span className="text-xs md:text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-sm ml-2">
              {wishlistItems.length} {t("items")}
            </span>
          </h1>
        </div>
      </div>

      {/* Content */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#E50914] rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative bg-muted p-10 rounded-full border border-border/5 ring-8 ring-border/5">
              <Heart className="size-20 text-muted-foreground" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight">
            {t("emptyTitle")}
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
            {t("emptyText")}
          </p>
          <Link 
            to="/" 
            className="group relative bg-[#E50914] hover:bg-[#f40612] text-white px-10 py-4 rounded-md font-extrabold text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(229,9,20,0.3)]"
          >
            {t("explore")}
          </Link>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <MovieGrid>
            {wishlistItems.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MovieGrid>
        </div>
      )}
    </div>
  );
}