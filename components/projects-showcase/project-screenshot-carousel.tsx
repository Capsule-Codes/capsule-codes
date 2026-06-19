"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { BrowserFrame, PhoneFrame } from "./device-frame";
import { useCarouselTween } from "./use-carousel-tween";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ProjectScreenshotCarouselProps {
  images: CarouselImage[];
  frame: "phone" | "browser";
  emptyBackground: string;
  onOpenLightbox: (index: number) => void;
}

export function ProjectScreenshotCarousel({
  images,
  frame,
  emptyBackground,
  onOpenLightbox,
}: ProjectScreenshotCarouselProps) {
  const isPhone = frame === "phone";
  const loop = images.length > 2;
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useCarouselTween(api, loop);

  const onSelect = useCallback((emblaApi: NonNullable<CarouselApi>) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const Frame = isPhone ? PhoneFrame : BrowserFrame;
  const aspect = isPhone ? "aspect-[9/19.5]" : "aspect-[16/10]";

  if (images.length === 0) {
    return (
      <div className="grid w-full place-items-center">
        <div className={cn("w-full", isPhone ? "max-w-[230px]" : "max-w-[600px]", aspect)}>
          <Frame>
            <div className="absolute inset-0" style={{ background: emptyBackground }} />
          </Frame>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel setApi={setApi} opts={{ align: "center", loop }} className="w-full">
        <CarouselContent className={isPhone ? "-ml-6" : "-ml-8"}>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "transition-[transform,opacity] duration-200 ease-out",
                isPhone ? "basis-[60%] pl-6 sm:basis-[38%]" : "basis-[88%] pl-8 sm:basis-[70%]",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  index === selectedIndex ? onOpenLightbox(index) : api?.scrollTo(index)
                }
                aria-label={image.alt}
                className={cn(
                  "block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                  isPhone ? "mx-auto w-full max-w-[200px]" : "w-full",
                  index === selectedIndex ? "cursor-zoom-in" : "cursor-pointer",
                  aspect,
                )}
              >
                <Frame>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={isPhone ? "200px" : "(min-width: 640px) 70vw, 88vw"}
                    className="object-cover"
                    priority={index === 0}
                  />
                </Frame>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 1 && (
        <div className="mx-auto mt-6 flex w-fit items-center gap-2.5 rounded-full border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] p-2 backdrop-blur">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => api?.scrollPrev()}
            className="grid size-[34px] place-items-center rounded-full border border-[color:var(--ink-line)] bg-[color:var(--hover-bg)] text-[color:var(--ink-fg)] transition-colors hover:bg-[color:var(--hover-bg-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5 px-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir a la imagen ${index + 1}`}
                aria-pressed={index === selectedIndex}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                  index === selectedIndex
                    ? "brand-grad w-[18px]"
                    : "w-1.5 bg-[color:var(--ink-line-strong)]",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => api?.scrollNext()}
            className="grid size-[34px] place-items-center rounded-full border border-[color:var(--ink-line)] bg-[color:var(--hover-bg)] text-[color:var(--ink-fg)] transition-colors hover:bg-[color:var(--hover-bg-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
