"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import type { Language } from "@/lib/i18n";
import { twinPath } from "@/lib/locale";

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
];

const LABELS: Record<Language, string> = {
  en: "Change language",
  es: "Cambiar idioma",
  it: "Cambia lingua",
};

/**
 * Each option is a plain link to the same page in that language, so crawlers
 * and no-JS visitors can follow it and the server renders the target locale.
 */
export function SimpleLanguageSwitcher() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 gap-2 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${LABELS[language]}: ${currentLanguage?.name ?? ""}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-[9999] min-w-[120px]">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={twinPath(pathname, lang.code)}
              hrefLang={lang.code}
              lang={lang.code}
              aria-current={language === lang.code ? "true" : undefined}
              className={`block w-full text-left px-3 py-2 hover:bg-muted first:rounded-t-md last:rounded-b-md ${
                language === lang.code ? "bg-muted" : ""
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
