"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Language } from "@/lib/i18n";
import { useState } from "react";

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
];

export function SimpleLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: langCode },
      })
    );
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-[9999] min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-3 py-2 hover:bg-muted first:rounded-t-md last:rounded-b-md ${
                language === lang.code ? "bg-muted" : ""
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
