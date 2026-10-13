import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { isLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/page-metadata";
import { TermsOfServiceClient } from "./terms-client";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildPageMetadata(locale, "terms") : {};
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <TermsOfServiceClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
