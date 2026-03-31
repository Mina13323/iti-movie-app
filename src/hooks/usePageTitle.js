import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function usePageTitle(title) {
  const { lang } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const suffix = " | NetMovies";
    
    document.title = `${title}${suffix}`;
    
    return () => {
      document.title = prevTitle;
    };
  }, [title, lang]);
}
