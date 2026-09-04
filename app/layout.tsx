import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LinkedInInsightTag } from "@/components/linkedin-insight-tag";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AmbientCursorGlow } from "@/components/motion/ambient-cursor-glow";
import { Suspense } from "react";
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

export const metadata: Metadata = {
  title: "Capsule Codes - Web & App Development",
  description:
    "React Native & Next.js development agency. We build production-ready mobile apps and web platforms for startups. 6+ projects across 6 countries. Direct access to senior developers.",
  generator: "v0.app",
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
  metadataBase: new URL("https://capsulecodes.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES", "it_IT"],
    url: "https://capsulecodes.com",
    siteName: "Capsule Codes",
    title: "Capsule Codes - Web & App Development",
    description:
      "React Native & Next.js development agency. We build production-ready mobile apps and web platforms for startups. 6+ projects across 6 countries. Direct access to senior developers.",
    images: [
      {
        url: "https://capsulecodes.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Capsule Codes — Mobile & Web Development for Startups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capsule Codes - Web & App Development",
    description:
      "React Native & Next.js development agency. We build production-ready mobile apps and web platforms for startups. 6+ projects across 6 countries. Direct access to senior developers.",
    images: ["https://capsulecodes.com/og-image.png"],
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AmbientCursorGlow />
            <LanguageProvider>{children}</LanguageProvider>
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </Suspense>
        <Analytics />
        <LinkedInInsightTag />
      </body>
    </html>
  );
}
