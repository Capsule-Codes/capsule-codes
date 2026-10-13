"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getTranslations, type Language, type Translations } from "@/lib/i18n";
import { localePath } from "@/lib/locale";

interface LanguageContextType {
  /** The language of the page, taken from the URL (`/es/...`, `/it/...`, else English). */
  language: Language;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/** The language comes from the route, never from browser storage. */
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Language;
  children: ReactNode;
}) {
  return (
    <LanguageContext.Provider
      value={{ language: locale, t: getTranslations(locale) }}
    >
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

/** Builds an internal link that stays in the current language ("/projects" -> "/es/projects"). */
export function useLocalePath() {
  const { language } = useLanguage();
  return (path: string) => localePath(language, path);
}
