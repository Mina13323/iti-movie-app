import { useLanguage } from "../../context/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();
  
  const languages = [
    { code: "en", label: "English", display: "EN" },
    { code: "ar", label: "العربية", display: "AR" },
    { code: "fr", label: "Français", display: "FR" },
    { code: "zh", label: "中文", display: "ZH" },
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md border border-border transition-all hover:bg-muted/80 group bg-muted/40 backdrop-blur-sm focus:outline-none",
            lang === "ar" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Globe className="size-4 text-[#E50914] group-hover:rotate-12 transition-all duration-300" strokeWidth={2.5} />
          <span className="text-[10px] font-black tracking-widest uppercase text-foreground/90">
            {currentLang.display}
          </span>
          <ChevronDown className="size-3 text-muted-foreground opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border border-border min-w-[120px] p-1 shadow-2xl">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className={cn(
               "flex items-center justify-between px-3 py-2 text-xs font-bold transition-all cursor-pointer rounded-sm mb-0.5",
               lang === l.code ? "bg-[#E50914] text-white" : "hover:bg-muted text-foreground"
            )}
          >
            {l.label}
            {lang === l.code && <span className="text-[8px] uppercase tracking-tighter opacity-70">Active</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
