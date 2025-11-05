"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Language } from "@/lib/i18n";

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: langCode },
      })
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[9999] bg-background border border-border shadow-lg min-w-[120px]"
        sideOffset={5}
        style={{ zIndex: 9999 }}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer hover:bg-muted ${
              language === lang.code ? "bg-muted" : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
