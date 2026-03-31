import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#E50914] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-in fade-in zoom-in slide-in-from-bottom-5",
        "hover:bg-[#f40612] ring-4 ring-black/10"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="size-6" strokeWidth={3} />
    </button>
  );
}
