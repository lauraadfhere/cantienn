"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { translations, Language } from "./i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k
});

export const useTranslation = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('wippel-lang') as Language;
    if (saved && ['en', 'fr', 'ar'].includes(saved)) {
      setLang(saved);
      // Force document direction update for RTL languages
      if (typeof document !== 'undefined') {
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = saved;
      }
    }
  }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('wippel-lang', l);
    // Force document direction update for RTL languages
    if (typeof document !== 'undefined') {
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = l;
    }
  };

  const t = useMemo(() => {
    return (key: string): string => {
      const translation = translations[lang];
      return (translation as any)[key] || (translations['en'] as any)[key] || key;
    };
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang: changeLang,
    t
  }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
