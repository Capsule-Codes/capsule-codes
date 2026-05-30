"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Review } from "@/lib/data-context";

interface ReviewsCarouselProps {
  reviews: Review[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const loading = false;
  const error: string | null = null;
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Check if Supabase is configured
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  // Get review content in current language
  const getReviewContent = (review: Review) => {
    if (
      review.translations &&
      review.translations[language as keyof typeof review.translations]
    ) {
      return review.translations[language as keyof typeof review.translations];
    }
    return {
      text: review.text,
      author: review.author,
      company: review.company,
      position: review.position,
    };
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Don't show anything if Supabase is not configured
  if (!isSupabaseConfigured) {
    return null;
  }

  if (loading) {
    return (
      <div className="relative max-w-[760px] mx-auto mt-12 lg:mt-14">
        <div className="rounded-3xl p-11 text-center bg-[var(--ink-bg-2)] border border-[color:var(--ink-line)] flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[color:var(--brand-cyan)]" />
          <span className="font-mono text-[12px] text-[color:var(--ink-muted)] uppercase tracking-[0.08em]">
            {language === "es"
              ? "Cargando reseñas..."
              : language === "it"
              ? "Caricamento recensioni..."
              : "Loading reviews..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative max-w-[760px] mx-auto mt-12 lg:mt-14">
        <div className="rounded-3xl p-11 text-center bg-[var(--ink-bg-2)] border border-[color:oklch(0.6_0.2_25_/_0.4)]">
          <h3 className="font-sans text-base font-semibold mb-2 text-foreground">
            {language === "es"
              ? "Error al cargar reseñas"
              : language === "it"
              ? "Errore nel caricamento delle recensioni"
              : "Error loading reviews"}
          </h3>
          <p className="font-mono text-[12px] text-[color:var(--ink-muted)]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="relative max-w-[760px] mx-auto mt-12 lg:mt-14">
        <div className="rounded-3xl p-11 text-center bg-[var(--ink-bg-2)] border border-[color:var(--ink-line)]">
          <h3 className="font-sans text-base font-semibold mb-2 text-foreground">
            {language === "es"
              ? "No hay reseñas disponibles"
              : language === "it"
              ? "Nessuna recensione disponibile"
              : "No reviews available"}
          </h3>
          <p className="font-mono text-[12px] text-[color:var(--ink-muted)] max-w-[420px] mx-auto leading-[1.6]">
            {language === "es"
              ? "Las reseñas aparecerán aquí una vez que se agreguen desde el panel de administración."
              : language === "it"
              ? "Le recensioni appariranno qui una volta aggiunte dal pannello di amministrazione."
              : "Reviews will appear here once added from the admin panel."}
          </p>
        </div>
      </div>
    );
  }

  const currentReview = reviews[currentIndex];
  const reviewContent = getReviewContent(currentReview);
  const filledStars = Math.max(0, Math.min(5, currentReview.rating ?? 0));

  return (
    <div className="relative max-w-[760px] mx-auto mt-12 lg:mt-14">
      {/* Review Card */}
      <div
        className="relative border border-[color:oklch(0.5_0.18_180_/_0.4)] rounded-3xl p-11 text-center"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.4 0.18 180 / 0.2), transparent 60%), var(--ink-bg-2)",
        }}
      >
        {/* Big quote mark */}
        <span
          aria-hidden="true"
          className="absolute top-4 left-6 select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "60px",
            lineHeight: 1,
            fontWeight: 600,
            color: "var(--brand-cyan)",
            opacity: 0.4,
          }}
        >
          “
        </span>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className={
                i < filledStars
                  ? "text-[color:oklch(0.85_0.16_90)]"
                  : "text-[color:var(--ink-muted)]/40"
              }
              style={{ fontSize: 16, lineHeight: 1 }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Quote text */}
        <blockquote className="text-lg leading-[1.5] text-foreground mb-7 italic max-w-[580px] mx-auto">
          {reviewContent.text}
        </blockquote>

        {/* Author block */}
        <div className="flex items-center justify-center gap-3">
          {currentReview.avatar ? (
            <img
              src={currentReview.avatar}
              alt={reviewContent.author}
              className="w-11 h-11 rounded-full object-cover border border-[color:var(--ink-line)]"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-background"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-grad-from), var(--brand-grad-to))",
              }}
            >
              {reviewContent.author.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground leading-tight">
              {reviewContent.author}
            </div>
            <div className="font-mono text-[11px] text-[color:var(--ink-muted)] leading-tight mt-0.5">
              {reviewContent.position}
              {reviewContent.position && reviewContent.company ? " · " : ""}
              {reviewContent.company}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          type="button"
          onClick={prevReview}
          aria-label="Previous review"
          className="w-9 h-9 rounded-full bg-[color:var(--hover-bg)] border border-[color:var(--ink-line)] inline-flex items-center justify-center text-foreground hover:bg-[color:var(--hover-bg-strong)] hover:border-[color:var(--ink-line-strong)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {reviews.map((_, index) => {
            const active = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Go to review ${index + 1}`}
                onClick={() => goToReview(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active
                    ? "w-6 bg-[color:var(--brand-cyan)]"
                    : "w-1.5 bg-[color:var(--ink-muted)]/40 hover:bg-[color:var(--ink-muted)]/60"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={nextReview}
          aria-label="Next review"
          className="w-9 h-9 rounded-full bg-[color:var(--hover-bg)] border border-[color:var(--ink-line)] inline-flex items-center justify-center text-foreground hover:bg-[color:var(--hover-bg-strong)] hover:border-[color:var(--ink-line-strong)] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
