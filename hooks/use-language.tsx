"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Language, getTranslations, type Translations } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [t, setTranslations] = useState<Translations>(getTranslations("en"));

  useEffect(() => {
    // Load language from localStorage or default to English
    const savedLanguage = localStorage.getItem(
      "capsule-codes-language"
    ) as Language;
    if (savedLanguage && ["en", "es", "it"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      setTranslations(getTranslations(savedLanguage));
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setTranslations(getTranslations(lang));
    localStorage.setItem("capsule-codes-language", lang);

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: lang },
      })
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
