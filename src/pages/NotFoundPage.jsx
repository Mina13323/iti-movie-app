import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block mb-4">
          <h1 className="text-9xl font-black text-[#E50914] tracking-tighter opacity-20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-widest uppercase">
              Lost
            </h2>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          {lang === "en" ? "Page Not Found" : "الصفحة غير موجودة"}
        </h2>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
          {lang === "en" 
            ? "Even the best search parties can't find this one. It might have been moved or deleted." 
            : "حتى أفضل فرق البحث لا يمكنها العثور على هذه الصفحة. ربما تم نقلها أو حذفها."}
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-[#E50914] text-white hover:bg-[#f40612] px-10 py-4 rounded font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(229,9,20,0.3)]"
        >
          <Home className="size-5" />
          {lang === "en" ? "Back to Home" : "العودة للرئيسية"}
        </Link>
      </div>
    </div>
  );
}
