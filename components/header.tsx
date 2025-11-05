"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { DebugLanguageSwitcher } from "@/components/debug-language-switcher";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#technologies", label: t.nav.technologies },
    { href: "#projects", label: t.nav.projects },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#contact", label: t.nav.contact },
  ];

  const handleNavClick = (href: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/capsule-codes-logo.png"
              alt="Capsule Codes"
              width={50}
              height={50}
              className="animate-pulse-glow"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Capsule Codes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-6 relative z-50">
            <DebugLanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-left cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center justify-between pt-2 relative z-50">
                <DebugLanguageSwitcher />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
