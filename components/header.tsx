"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { SimpleLanguageSwitcher } from "@/components/simple-language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

const HIDE_THRESHOLD = 200;

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hidden, setHidden] = useState(false);

  const navItems = [
    { href: "#about", label: t.nav.about, id: "about" },
    { href: "#services", label: t.nav.services, id: "services" },
    { href: "#technologies", label: t.nav.technologies, id: "technologies" },
    { href: "#team", label: t.nav.team, id: "team" },
    { href: "#projects", label: t.nav.projects, id: "projects" },
    { href: "#reviews", label: t.nav.reviews, id: "reviews" },
  ];

  // Hide-on-scroll-down + active section detection (throttled via rAF)
  useEffect(() => {
    let raf = 0;
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - lastY;

      if (y > HIDE_THRESHOLD && delta > 4) {
        setHidden(true);
      } else if (delta < -4 || y <= HIDE_THRESHOLD) {
        setHidden(false);
      }
      lastY = y;

      // Active section detection (only on home)
      if (pathname === "/") {
        const scrollPosition = y + 150;
        let current = "";
        for (let i = navItems.length - 1; i >= 0; i--) {
          const el = document.getElementById(navItems[i].id);
          if (!el) continue;
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = navItems[i].id;
            break;
          }
        }
        setActiveSection(current);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while mobile menu open
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMenuOpen]);

  const handleNavClick = useCallback((href: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  }, []);

  const isActive = (id: string) => activeSection === id;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        hidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="bg-background/70 backdrop-blur-xl border-b border-[color:var(--ink-line)]">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="shrink-0 cursor-pointer"
            aria-label="Go to home"
          >
            <Image
              src="/images/capsule-codes-logo-transparent-cropped.png"
              alt="Capsule Codes"
              width={795}
              height={908}
              className="h-12 w-auto object-contain sm:h-14"
              priority
            />
          </button>

          {/* Center pill nav (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center bg-[color:var(--hover-bg)] border border-[color:var(--ink-line)] rounded-full p-1"
          >
            {navItems.map((item) => {
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "text-xs px-3.5 py-1.5 rounded-full transition cursor-pointer",
                    active
                      ? "bg-[color:var(--hover-bg-strong)] text-foreground"
                      : "text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: language + CTA (desktop) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <SimpleLanguageSwitcher />
            <ThemeToggle />
            <Magnetic>
              <button
                onClick={() => handleNavClick("#contact")}
                className="brand-grad text-on-grad rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {t.nav.contact}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </Magnetic>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <SimpleLanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
              className="p-2 rounded-full text-foreground hover:bg-[color:var(--hover-bg)] transition cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay panel */}
      {isMenuOpen && (
        <div
          className="lg:hidden absolute left-0 right-0 top-full h-[calc(100dvh-60px)] overflow-y-auto border-t border-[color:var(--ink-line)] bg-background/95 backdrop-blur-xl"
        >
          <nav
            aria-label="Mobile primary"
            className="container mx-auto px-6 py-6 flex flex-col gap-2"
          >
            {navItems.map((item) => {
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "text-left text-base px-4 py-3 rounded-2xl transition cursor-pointer border border-transparent",
                    active
                      ? "bg-[color:var(--hover-bg-strong)] text-foreground border-[color:var(--ink-line)]"
                      : "text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-[color:var(--ink-line)]">
              <button
                onClick={() => handleNavClick("#contact")}
                className="w-full brand-grad text-on-grad rounded-full px-4 py-3 text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {t.nav.contact}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
