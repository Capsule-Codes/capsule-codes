"use client";

import { ReviewsCarousel } from "./reviews-carousel";
import { useLanguage } from "@/hooks/use-language";

export function ReviewsSection() {
  const { t } = useLanguage();

  // Check if Supabase is configured
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Don't render the section if Supabase is not configured
  if (!isSupabaseConfigured) {
    return null;
  }

  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            {t.reviews.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.reviews.subtitle}
          </p>
        </div>

        <ReviewsCarousel />
      </div>
    </section>
  );
}
