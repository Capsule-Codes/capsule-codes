"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { DebugLanguageSwitcher } from "@/components/debug-language-switcher";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "#about", label: t.nav.about, id: "about" },
    { href: "#services", label: t.nav.services, id: "services" },
    { href: "#technologies", label: t.nav.technologies, id: "technologies" },
    { href: "#projects", label: t.nav.projects, id: "projects" },
    { href: "#reviews", label: t.nav.reviews, id: "reviews" },
    { href: "#contact", label: t.nav.contact, id: "contact" },
  ];

  // Detect active section based on scroll position
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      setActiveSection("");
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Set active section based on pathname
  useEffect(() => {
    if (pathname === "/projects") {
      setActiveSection("projects");
    } else if (pathname.startsWith("/projects/")) {
      setActiveSection("projects");
    } else {
      setActiveSection("");
    }
  }, [pathname]);

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

  const isActive = (itemId: string) => {
    return activeSection === itemId;
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-40">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              src="/logo.svg"
              alt="Capsule Codes"
              width={40}
              height={40}
              className="animate-pulse w-8 h-8 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px]"
            />
            <span className="hidden xs:inline text-base sm:text-lg md:text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Capsule Codes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`transition-colors duration-200 font-medium cursor-pointer ${
                  isActive(item.id)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center space-x-6 relative z-50">
            <DebugLanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
          <nav className="lg:hidden mt-3 pb-3 border-t border-border">
            <div className="flex flex-col space-y-3 pt-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`transition-colors duration-200 font-medium text-left cursor-pointer py-1 ${
                    isActive(item.id)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center pt-2 border-t border-border/50 relative z-50">
                <DebugLanguageSwitcher />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
