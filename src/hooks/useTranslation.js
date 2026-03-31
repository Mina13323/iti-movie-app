import { useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";

/**
 * A unified hook to handle translations across the app.
 * Can be used with a local dictionary or a global one.
 */
export const useTranslation = (translations = {}) => {
  const { lang } = useLanguage();

  const t = useCallback((key, params = {}) => {
    const entry = translations[key];
    if (!entry) return key;

    let text = entry[lang] || entry.en || key;

    // Handle template parameters like {query}
    Object.keys(params).forEach((param) => {
      text = text.replace(`{${param}}`, params[param]);
    });

    return text;
  }, [translations, lang]);

  return { t, lang };
};
