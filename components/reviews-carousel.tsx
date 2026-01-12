"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Review } from "@/lib/data-context";

interface ReviewsCarouselProps {
  reviews: Review[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const loading = false;
  const error = null;
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
    }, 5000); // Change every 5 seconds

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">
          {language === "es"
            ? "Cargando reseñas..."
            : language === "it"
            ? "Caricamento recensioni..."
            : "Loading reviews..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-2">⚠️</div>
          <h3 className="text-red-800 font-medium mb-2">
            {language === "es"
              ? "Error al cargar reseñas"
              : language === "it"
              ? "Errore nel caricamento delle recensioni"
              : "Error loading reviews"}
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-gray-600 mb-2">📝</div>
          <h3 className="text-gray-800 font-medium mb-2">
            {language === "es"
              ? "No hay reseñas disponibles"
              : language === "it"
              ? "Nessuna recensione disponibile"
              : "No reviews available"}
          </h3>
          <p className="text-gray-600 text-sm">
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* Main Review Card */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-2 border-primary/20 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              {/* Stars Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < currentReview.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                "{reviewContent.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {currentReview.avatar ? (
                    <img
                      src={currentReview.avatar}
                      alt={reviewContent.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {reviewContent.author.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-lg text-foreground">
                  {reviewContent.author}
                </h4>
                <p className="text-muted-foreground">
                  {reviewContent.position} at {reviewContent.company}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(currentReview.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevReview}
            className="hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextReview}
            className="hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Auto-play Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isAutoPlaying ? "⏸️ Pause" : "▶️ Auto-play"}
          </Button>
        </div>
      </div>
    </div>
  );
}
