"use client";

import { ReviewsCarousel } from "./reviews-carousel";
import { useLanguage } from "@/hooks/use-language";
import { SectionHeader } from "@/components/ui/section-header";
import type { Review } from "@/lib/data-context";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { t } = useLanguage();
  const titleWords = t.reviews.title.split(" ");
  const lastWord = titleWords.pop() ?? "";
  const leading = titleWords.join(" ");

  return (
    <section
      id="reviews"
      className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]"
    >
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="— 06 / Reviews"
          align="center"
          title={
            <>
              {leading} <em className="not-italic text-brand-grad">{lastWord}</em>
            </>
          }
          lead={t.reviews.subtitle}
        />
        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
}
