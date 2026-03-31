import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, User, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { ModeToggle } from "./ModeToggle";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthStore } from "../../store/useAuthStore";
import { useAuthGuard } from "../../context/AuthGuardContext";
import { useTranslation } from "../../hooks/useTranslation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { authUser, logout, isAuthenticated } = useAuthStore();
  const { ensureAuthenticated } = useAuthGuard();

  // Add scroll listener for Netflix style solid background transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarTranslations = {
    home: { en: "Home", ar: "الرئيسية", fr: "Accueil", zh: "首页" },
    movies: { en: "Movies", ar: "الأفلام", fr: "Films", zh: "电影" },
    series: { en: "Series", ar: "المسلسلات", fr: "Séries", zh: "剧集" },
    wishlist: { en: "My list", ar: "قائمتي", fr: "Ma liste", zh: "我的列表" },
    signin: { en: "Sign In", ar: "تسجيل الدخول", fr: "Se connecter", zh: "登录" },
    signout: { en: "Sign Out", ar: "تسجيل الخروج", fr: "Déconnexion", zh: "退出" },
    settings: { en: "Settings", ar: "الإعدادات", fr: "Paramètres", zh: "设置" },
    member: { en: "Netflix Member", ar: "عضو نيتفليكس", fr: "Membre Netflix", zh: "Netflix 会员" },
    logo: { en: "NetMovies Home", ar: "نيتفليكس الرئيسية", fr: "NetMovies Accueil", zh: "NetMovies 首页" },
    search: { en: "Search Movies", ar: "البحث عن أفلام", fr: "Rechercher", zh: "搜索" }
  };
  
  const { t } = useTranslation(navbarTranslations);

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("movies"), path: "/movies" },
    { name: t("series"), path: "/series" },
    { name: t("wishlist"), path: "/wishlist", hasDropdown: true },
  ];

  return (
    <header
        className={cn(
          "fixed top-0 w-full z-50 transition-colors duration-500 border-b border-transparent",
          scrolled
            ? "bg-background border-border"
            : "bg-transparent dark:bg-gradient-to-b dark:from-black/80 dark:via-black/40 dark:to-transparent"
        )}
      >
        <div className="px-4 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-foreground hover:text-muted-foreground transition duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
            </button>

            {/* Logo */}
            <Link 
              to="/" 
              className="font-black text-2xl md:text-3xl tracking-tighter"
              style={{ color: "#E50914" }} // Netflix Signature Red
              aria-label={t("logo")}
            >
              NETMOVIES
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
                const isHome = link.path === '/';
                
                const handleLinkClick = (e) => {
                  if (isHome) return;
                  e.preventDefault();
                  ensureAuthenticated(() => {
                    navigate(link.path);
                  });
                };

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-muted-foreground flex items-center gap-1 relative",
                      isActive ? "text-foreground font-semibold cursor-default hover:text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="size-4 ml-0.5 opacity-70" />}
                    {isActive && (
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 min-w-[5px] min-h-[5px] bg-[#E50914] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Utilities */}
          <div className="flex items-center gap-4 md:gap-7 text-foreground">
            <div className="hidden sm:flex items-center gap-4">
              <LanguageSwitcher />
              <ModeToggle />
            </div>

            <Link to="/search" className="hover:text-muted-foreground transition duration-300" aria-label={t("search")}>
              <Search className="size-6" strokeWidth={2.5} />
            </Link>
            
            <button className="hover:text-muted-foreground transition duration-300 hidden md:inline-block">
              <Bell className="size-6" strokeWidth={2.5} />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-foreground leading-none">{authUser?.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{t("member")}</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer group relative">
                  <Avatar className="size-8 rounded-sm outline outline-1 outline-transparent group-hover:outline-gray-300 transition-all flex items-center justify-center shadow-md">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.email}`} alt={authUser?.name} className="object-cover" />
                    <AvatarFallback className="rounded-sm bg-muted flex items-center justify-center">
                      <User className="size-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Desktop Dropdown - simplified to just a logout for now */}
                  <button 
                    onClick={logout}
                    className="p-1 hover:text-[#E50914] transition-colors"
                    title="Logout"
                  >
                    <LogOut className="size-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-[#E50914] text-white px-4 py-1.5 rounded-sm text-sm font-bold hover:bg-[#c11119] transition-colors">
                {t("signin")}
              </Link>
            )}
            <ChevronDown className="size-4 opacity-70 hidden lg:inline-block" />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div 
          className={cn(
            "lg:hidden absolute top-full left-0 w-full bg-background border-t border-border transition-all duration-300 overflow-hidden",
            isMenuOpen ? "max-h-screen py-6 opacity-100 shadow-2xl" : "max-h-0 py-0 opacity-0"
          )}
        >
          <nav className="flex flex-col items-center gap-6 px-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
              const isHome = link.path === '/';

              const handleMobileLinkClick = (e) => {
                if (isHome) {
                  setIsMenuOpen(false);
                  return;
                }
                e.preventDefault();
                setIsMenuOpen(false);
                ensureAuthenticated(() => {
                  navigate(link.path);
                });
              };

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={handleMobileLinkClick}
                  className={cn(
                    "text-lg font-bold transition-colors w-full text-center py-2",
                    isActive ? "text-[#E50914]" : "text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
                {/* Mobile Menu Footer */}
                <div className="w-full pt-4 border-t border-border flex flex-col items-center gap-4">
                  {isAuthenticated && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="size-10 rounded-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.email}`} alt={authUser?.name} />
                          <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-foreground font-bold">{authUser?.name}</p>
                          <p className="text-muted-foreground text-xs">Standard Plan</p>
                        </div>
                      </div>
                      <button 
                        onClick={logout}
                        className="w-full text-center py-3 text-muted-foreground hover:text-foreground font-bold flex items-center justify-center gap-2 border border-border rounded-md"
                      >
                        <LogOut className="size-5" />
                        {t("signout")}
                      </button>
                    </div>
                  )}
                  <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">{t("settings")}</span>
                  <div className="flex flex-col items-center gap-4 py-2">
                    <div className="scale-110">
                      <LanguageSwitcher />
                    </div>
                    <div className="scale-110">
                      <ModeToggle />
                    </div>
                  </div>
                </div>
          </nav>
        </div>
      </header>
  );
}