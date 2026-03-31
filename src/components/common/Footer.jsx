import { Link } from "react-router-dom";
import { Share2, Globe, Info, MessageSquare } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../hooks/useTranslation";

export default function Footer() {
  const { lang } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const footerPageTranslations = {
    nav: { en: "Navigation", ar: "التنقل", fr: "Navigation", zh: "导航" },
    home: { en: "Home", ar: "الرئيسية", fr: "Accueil", zh: "首页" },
    movies: { en: "Movies", ar: "الأفلام", fr: "Films", zh: "电影" },
    series: { en: "Series", ar: "المسلسلات", fr: "Séries", zh: "剧集" },
    wishlist: { en: "My List", ar: "قائمتي", fr: "Ma liste", zh: "我的列表" },
    legal: { en: "Legal", ar: "قانوني", fr: "Légal", zh: "法律声明" },
    privacy: { en: "Privacy Policy", ar: "سياسة الخصوصية", fr: "Confidentialité", zh: "隐私政策" },
    terms: { en: "Terms of Use", ar: "شروط الاستخدام", fr: "Conditions", zh: "使用条款" },
    cookies: { en: "Cookies", ar: "ملفات التعريف", fr: "Cookies", zh: "Cookies" },
    contact: { en: "Contact", ar: "اتصل بنا", fr: "Contact", zh: "联系我们" },
    support: { en: "Support Center", ar: "مركز الدعم", fr: "Aide", zh: "支持中心" },
    media: { en: "Media Center", ar: "مركز الإعلام", fr: "Médias", zh: "媒体中心" },
    careers: { en: "Careers", ar: "الوظائف", fr: "Carrières", zh: "Carrières" },
    storyTitle: { en: "Our Story", ar: "قصتنا", fr: "Notre Histoire", zh: "我们的故事" },
    storyText: { 
      en: "NETMOVIES is a premium cinematic platform offering the best collection of movies and series for your entertainment experience.", 
      ar: "NETMOVIES هي منصة سينمائية متميزة تقدم أفضل مجموعة من الأفلام والمسلسلات لتجربة ترفيهية رائعة.", 
      fr: "NETMOVIES est une plateforme cinématographique premium offrant la meilleure collection de films et séries.", 
      zh: "NETMOVIES 是一个优质的电影平台，为您提供最精彩的热播影视剧。" 
    }
  };

  const { t } = useTranslation(footerPageTranslations);

  const footerLinks = [
    { title: t("nav"), links: [
      { name: t("home"), path: "/" },
      { name: t("movies"), path: "/movies" },
      { name: t("series"), path: "/series" },
      { name: t("wishlist"), path: "/wishlist" },
    ]},
    { title: t("legal"), links: [
      { name: t("privacy"), path: "#" },
      { name: t("terms"), path: "#" },
      { name: t("cookies"), path: "#" },
    ]},
    { title: t("contact"), links: [
      { name: t("support"), path: "#" },
      { name: t("media"), path: "#" },
      { name: t("careers"), path: "#" },
    ]},
  ];

  return (
    <footer className="bg-background text-muted-foreground py-16 px-6 md:px-12 lg:px-24 border-t border-border mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8 mb-10 text-muted-foreground">
          <Share2 className="size-6 cursor-pointer hover:text-foreground transition-colors" />
          <Globe className="size-6 cursor-pointer hover:text-foreground transition-colors" />
          <Info className="size-6 cursor-pointer hover:text-foreground transition-colors" />
          <MessageSquare className="size-6 cursor-pointer hover:text-foreground transition-colors" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em]">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm hover:underline transition-all">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="space-y-4">
            <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em]">{t("storyTitle")}</h4>
            <p className="text-xs leading-relaxed max-w-xs font-semibold">
              {t("storyText")}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[#E50914] font-black text-xl tracking-tighter">
              NETMOVIES
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest font-bold">© {currentYear} NETMOVIES, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
            <span className="hidden sm:inline">Made by ITI-MERN-Stack-Team</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-700 rounded-full"></span>
            <a href="https://github.com/Mina13323" className="hover:text-foreground transition-colors underline underline-offset-4">GitHub Profile</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
