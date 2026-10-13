import type React from "react";
import type { Metadata } from "next";
import { LinkedInInsightTag } from "@/components/linkedin-insight-tag";
import { LanguageProvider } from "@/hooks/use-language";
import { RootDocument } from "@/components/root-document";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site";

// en is internal (reached through the middleware rewrite), es and it are public.
// `dynamicParams` stays on so unknown paths reach the localized not-found.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  // Site-wide defaults. Pages override title, description, alternates and cards.
  const home = buildPageMetadata(locale, "home");
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

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params;
  // Next renders this layout without params when it builds the global 404, so
  // fall back to English there instead of throwing. Real requests always carry
  // a valid locale: the middleware rewrites everything else under `en`.
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <RootDocument lang={locale} afterBody={<LinkedInInsightTag />}>
      <LanguageProvider locale={locale}>{children}</LanguageProvider>
    </RootDocument>
  );
}
