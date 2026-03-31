import { useEffect, useState } from "react";
import { getGenres, getTVGenres } from "../../services/movieService";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, SortAsc } from "lucide-react";

export default function MovieFilters({ 
  type = "movie",
  selectedGenre, 
  onGenreSelect, 
  selectedSort, 
  onSortSelect 
}) {
  const { lang } = useLanguage();
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = type === "movie" ? getGenres : getTVGenres;
    fetchGenres()
      .then((res) => {
        setGenres(res.data.genres || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [lang, type]);

  const sortOptions = [
    { value: "popularity.desc", label: { en: "Most Popular", ar: "الأكثر شعبية", fr: "Le plus populaire", zh: "最受欢迎" } },
    { value: "vote_average.desc", label: { en: "Top Rated", ar: "الأعلى تقييماً", fr: "Le mieux noté", zh: "评分最高" } },
    { value: "primary_release_date.desc", label: { en: "Newest", ar: "الأحدث إصداراً", fr: "Le plus récent", zh: "最新上映" } },
    { value: "revenue.desc", label: { en: "Box Office", ar: "شباك التذاكر", fr: "Box-office", zh: "票房最高" } },
  ];

  const t = {
    genres: { en: "Categories", ar: "التصنيفات", fr: "Catégories", zh: "类别" },
    sorting: { en: "Sort By", ar: "ترتيب حسب", fr: "Trier par", zh: "排序方式" },
    all: { en: "All", ar: "الكل", fr: "Tous", zh: "全部" }
  };

  const getLabel = (obj) => obj[lang] || obj["en"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Genre Pills */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-black uppercase tracking-[0.2em]">
          <Filter className="size-3" />
          {getLabel(t.genres)}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!selectedGenre ? "default" : "outline"}
            className={cn(
              "px-4 py-1.5 cursor-pointer transition-all active:scale-95 text-[10px] font-bold tracking-widest uppercase",
              !selectedGenre ? "bg-[#E50914] hover:bg-[#c11119] border-none" : "hover:bg-muted"
            )}
            onClick={() => onGenreSelect(null)}
          >
            {getLabel(t.all)}
          </Badge>
          {isLoading ? (
             [...Array(10)].map((_, i) => (
                <div key={i} className="h-7 w-20 bg-muted animate-pulse rounded-full" />
             ))
          ) : (
            genres.map((genre) => (
              <Badge
                key={genre.id}
                variant={selectedGenre === genre.id ? "default" : "outline"}
                className={cn(
                  "px-4 py-1.5 cursor-pointer transition-all active:scale-95 text-[10px] font-bold tracking-widest uppercase",
                  selectedGenre === genre.id ? "bg-[#E50914] hover:bg-[#c11119] border-none" : "hover:bg-muted"
                )}
                onClick={() => onGenreSelect(genre.id)}
              >
                {genre.name}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Sort Select */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-black uppercase tracking-[0.2em]">
          <SortAsc className="size-3" />
          {getLabel(t.sorting)}
        </div>
        <Select value={selectedSort} onValueChange={onSortSelect}>
          <SelectTrigger className="w-full sm:w-[240px] bg-muted/30 border-border h-10 font-bold text-xs uppercase tracking-widest">
            <SelectValue placeholder="Sort movies..." />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-xl border-border">
            {sortOptions.map((opt) => (
              <SelectItem 
                key={opt.value} 
                value={opt.value}
                className="text-[10px] font-black uppercase tracking-widest focus:bg-muted cursor-pointer"
              >
                {getLabel(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
