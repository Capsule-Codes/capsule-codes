"use client";

import { ReviewsCarousel } from "./reviews-carousel";
import { useLanguage } from "@/hooks/use-language";
import type { Review } from "@/lib/data-context";

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { t } = useLanguage();

  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-background scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.reviews.title.split(" ")[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.reviews.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t.reviews.subtitle}
          </p>
        </div>

        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
}
