"use client";

import { useCallback } from "react";
import Image from "next/image";
import { Linkedin, Github } from "lucide-react";
import { useConsent } from "@/hooks/use-consent";
import { useLanguage, useLocalePath } from "@/hooks/use-language";
import { isHomePath } from "@/lib/locale";

export function Footer() {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const { openSettings } = useConsent();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.team, href: "#team" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.products, href: "#products" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const handleNavClick = useCallback((href: string) => {
    if (!isHomePath(window.location.pathname)) {
      window.location.href = localePath(`/${href}`);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, [localePath]);

  return (
    <footer className="px-4 lg:px-12 py-[50px] pb-8 border-t border-[color:var(--ink-line)]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand + tagline */}
          <div>
            <Image
              src="/images/capsule-codes-logo-360.webp"
              alt="Capsule Codes"
              width={360}
              height={411}
              className="mx-auto h-auto w-[180px] sm:w-[170px] md:mx-0 md:w-[160px]"
            />
            <p className="text-[12.5px] text-[color:var(--ink-muted)] leading-[1.5] mt-3 max-w-xs">
              {t.footer.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">
              — {t.footer.quickLinks}
            </h3>
            {quickLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block cursor-pointer py-1 text-left text-[13px] text-[color:var(--ink-muted)] transition hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">
              — Legal
            </h3>
            <a
              href={localePath("/privacy")}
              className="block text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
            >
              {t.footer.privacyPolicy}
            </a>
            <a
              href={localePath("/terms")}
              className="block text-[13px] text-[color:var(--ink-muted)] py-1 hover:text-foreground transition"
            >
              {t.footer.termsOfService}
            </a>
            <button
              type="button"
              onClick={openSettings}
              className="block cursor-pointer py-1 text-left text-[13px] text-[color:var(--ink-muted)] transition hover:text-foreground"
            >
              {t.consent.settings}
            </button>
          </div>

          {/* Column 4: Follow */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">
              — {t.footer.followUs}
            </h3>
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
              href="https://github.com/facupascale"
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
          </div>
        </div>
      </div>
    </footer>
  );
}
