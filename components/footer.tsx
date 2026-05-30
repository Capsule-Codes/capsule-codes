"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickLinks = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.team, href: "#team" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <footer className="px-4 lg:px-12 py-[50px] pb-8 border-t border-[color:var(--ink-line)]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand + tagline */}
          <div>
            <div className="font-mono text-sm font-semibold">
              capsule<span className="text-[color:var(--brand-cyan)]">.</span>codes
            </div>
            <p className="text-[12.5px] text-[color:var(--ink-muted)] leading-[1.5] mt-3 max-w-xs">
              {t.footer.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h6 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">
              — {t.footer.quickLinks}
            </h6>
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 3: Legal */}
          <div>
            <h6 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">
              — Legal
            </h6>
            <a
              href="/privacy"
              className="block text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
            >
              {t.footer.privacyPolicy}
            </a>
            <a
              href="/terms"
              className="block text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
            >
              {t.footer.termsOfService}
            </a>
          </div>

          {/* Column 4: Follow */}
          <div>
            <h6 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">
              — {t.footer.followUs}
            </h6>
            <a
              href="https://www.linkedin.com/company/capsulecodes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-[color:var(--ink-line)] flex flex-col md:flex-row md:justify-between md:items-center gap-3 text-xs text-[color:var(--ink-muted)]">
          <span>
            © {currentYear} Capsule Codes. {t.footer.rights}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono">{t.footer.quote}</span>
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-foreground transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
