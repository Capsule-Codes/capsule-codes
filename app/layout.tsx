import type React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LinkedInInsightTag } from "@/components/linkedin-insight-tag";
import { CookieBanner } from "@/components/cookie-banner";
import { ConsentProvider } from "@/hooks/use-consent";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AmbientCursorGlow } from "@/components/motion/ambient-cursor-glow";
import { LOCALE_HEADER, resolveRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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

/** The middleware tells the layout which language the request is served in. */
function requestLocale() {
  return resolveRequestLocale(headers().get(LOCALE_HEADER));
}

export function generateMetadata(): Metadata {
  // Site-wide defaults. Pages override title, description, alternates and cards.
  const home = buildPageMetadata(requestLocale(), "home");
  return {
    title: home.title,
    description: home.description,
    keywords: [
      "React Native development",
      "Next.js development",
      "mobile app development",
      "web platform development",
      "startup development",
      "TypeScript",
      "Node.js",
      "Supabase",
      "full-stack development",
      "mobile app agency",
      "fintech development",
      "edtech development",
    ],
    authors: [{ name: "Capsule Codes" }],
    creator: "Capsule Codes",
    publisher: "Capsule Codes",
    icons: {
      icon: "/logo.svg",
      apple: "/logo.svg",
    },
    metadataBase: new URL(SITE_URL),
    openGraph: home.openGraph,
    twitter: home.twitter,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = requestLocale();

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
