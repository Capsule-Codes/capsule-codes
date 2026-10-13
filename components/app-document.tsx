import type React from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LinkedInInsightTag } from "@/components/linkedin-insight-tag";
import { CookieBanner } from "@/components/cookie-banner";
import { ConsentProvider } from "@/hooks/use-consent";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AmbientCursorGlow } from "@/components/motion/ambient-cursor-glow";
import type { Locale } from "@/lib/locale";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * The `<html>` document shared by every root layout (`app/[locale]` and
 * `app/admin`): fonts, theme, language, consent and analytics. The language
 * comes from the route, so the document never reads request headers and the
 * public pages can be statically cached.
 */
export function AppDocument({
  locale,
  children,
}: Readonly<{
  locale: Locale;
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AmbientCursorGlow />
          <LanguageProvider locale={locale}>
            <ConsentProvider>
              {children}
              <CookieBanner />
              <LinkedInInsightTag />
            </ConsentProvider>
          </LanguageProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        {/* Vercel Analytics is cookieless: no consent needed. */}
        <Analytics />
      </body>
    </html>
  );
}
