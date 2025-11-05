"use client";

import { ReviewsCarousel } from "./reviews-carousel";
import { useLanguage } from "@/hooks/use-language";

export function ReviewsSection() {
  const { language } = useLanguage();

  // Check if Supabase is configured
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Don't render the section if Supabase is not configured
  if (!isSupabaseConfigured) {
    return null;
  }

  const sectionTitles = {
    en: {
      title: "What Our Clients Say",
      subtitle:
        "Don't just take our word for it - hear from the businesses we've helped transform",
    },
    es: {
      title: "Lo Que Dicen Nuestros Clientes",
      subtitle:
        "No solo tomes nuestra palabra - escucha a las empresas que hemos ayudado a transformar",
    },
    it: {
      title: "Cosa Dicono I Nostri Clienti",
      subtitle:
        "Non prendere solo la nostra parola - ascolta le aziende che abbiamo aiutato a trasformare",
    },
  };

  const currentTitles =
    sectionTitles[language as keyof typeof sectionTitles] || sectionTitles.en;

  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            {currentTitles.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {currentTitles.subtitle}
          </p>
        </div>

        <ReviewsCarousel />
      </div>
    </section>
  );
}
