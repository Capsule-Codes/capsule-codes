import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/components/theme-provider";
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
    "Transforming ideas into digital reality with cutting-edge technology. Expert web and mobile app development services.",
  generator: "v0.app",
  keywords: [
    "web development",
    "app development",
    "mobile apps",
    "fullstack development",
    "Next.js",
    "React",
    "TypeScript",
    "Supabase",
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
      "Transforming ideas into digital reality with cutting-edge technology. Expert web and mobile app development services.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Capsule Codes Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capsule Codes - Web & App Development",
    description:
      "Transforming ideas into digital reality with cutting-edge technology",
    images: ["/logo.svg"],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
