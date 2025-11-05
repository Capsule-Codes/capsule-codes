import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/hooks/use-language";
import { DataProvider } from "@/lib/data-context";
import { SupabaseProvider } from "@/lib/supabase-context";
import { AuthProvider } from "@/hooks/use-auth";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capsule Codes - Web & App Development",
  description:
    "Transforming ideas into digital reality with cutting-edge technology",
  generator: "v0.app",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <SupabaseProvider>
            <AuthProvider>
              <DataProvider>
                <LanguageProvider>{children}</LanguageProvider>
              </DataProvider>
            </AuthProvider>
          </SupabaseProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
