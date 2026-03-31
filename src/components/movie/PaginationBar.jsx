import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "@/lib/utils";

export default function PaginationBar({ currentPage, totalPages, onPageChange }) {
  const { lang } = useLanguage();
  
  if (totalPages <= 1) return null;

  const t = {
    prev: { en: "Previous", ar: "السابق", fr: "Précédent", zh: "上一页" },
    next: { en: "Next", ar: "التالي", fr: "Suivant", zh: "下一页" },
    page: { en: "Page", ar: "صفحة", fr: "Page", zh: "第 ... 页" }
  };

  const getLabel = (obj) => obj[lang] || obj["en"];

  // Helper to generate page numbers
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => onPageChange(i)}
          className={cn(
            "size-9 p-0 font-black text-xs transition-all duration-300",
            currentPage === i ? "bg-[#E50914] hover:bg-[#c11119] border-none shadow-lg shadow-[#E50914]/20" : "hover:bg-muted border-border"
          )}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-border mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground order-2 sm:order-1">
        {getLabel(t.page)} <span className="text-foreground text-sm mx-1">{currentPage}</span> 
        of <span className="text-foreground text-sm mx-1">{Math.min(totalPages, 500)}</span> 
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="gap-2 font-black text-xs uppercase tracking-widest px-4 border-border hover:bg-muted transition-all active:scale-95 disabled:opacity-30"
        >
          {lang === "ar" ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          <span className="hidden sm:inline">{getLabel(t.prev)}</span>
        </Button>

        <div className="hidden md:flex items-center gap-2">
          {renderPageNumbers()}
        </div>

        <Button
          variant="outline"
          disabled={currentPage >= totalPages || currentPage >= 500}
          onClick={() => onPageChange(currentPage + 1)}
          className="gap-2 font-black text-xs uppercase tracking-widest px-4 border-border hover:bg-muted transition-all active:scale-95 disabled:opacity-30"
        >
          <span className="hidden sm:inline">{getLabel(t.next)}</span>
          {lang === "ar" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
