import type React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppDocument } from "@/components/app-document";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** English, Spanish and Italian are prerendered; `/en` is redirected by the middleware. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale: segment } = await params;
  // Site-wide defaults. Pages override title, description, alternates and cards.
  const home = buildPageMetadata(isLocale(segment) ? segment : DEFAULT_LOCALE, "home");
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

/**
 * Root layout of the public site: the locale comes from the route segment
 * (`/es`, `/it`; English is rewritten to `/en` by the middleware), not from a
 * request header, so every page under it can be cached.
 */
export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AppDocument locale={locale}>{children}</AppDocument>;
}
