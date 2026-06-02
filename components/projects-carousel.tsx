"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Capsule } from "@/components/ui/capsule";
import { useLanguage } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";
import type { Language } from "@/lib/i18n";
import { resolveProjectGradient } from "@/lib/gradient-presets";

interface ProjectsCarouselProps {
  projects: Project[];
}

export function getProjectContent(project: Project, language: Language) {
  if (
    project.translations &&
    project.translations[language as keyof typeof project.translations]
  ) {
    return project.translations[language as keyof typeof project.translations];
  }
  return {
    title: project.title,
    subtitle: undefined as string | undefined,
    description: project.description,
  };
}

export function getCategoryLabel(
  category: Project["category"],
  t: ReturnType<typeof useLanguage>["t"]
): string {
  switch (category) {
    case "web":
      return t.projects.categories.webApp;
    case "mobile":
      return t.projects.categories.mobileApp;
    case "fullstack":
      return t.projects.categories.webPlatform;
    default:
      return t.projects.categories.webApp;
  }
}

export function getProjectImage(project: Project): string | null {
  if (project.image) return project.image;
  if (project.images && project.images.length > 0) {
    return project.images[0].blobKey ?? null;
  }
  return null;
}

export function isPortraitImage(
  img?: { width?: number; height?: number } | null
): boolean {
  return !!img?.width && !!img?.height && img.height > img.width;
}

export function getProjectThumb(project: Project): {
  url: string | null;
  portrait: boolean;
} {
  // Prefer the dimensioned images[] (the source of truth the detail page uses)
  // so card and detail agree on orientation. The legacy `project.image` mirrors
  // images[0]'s URL but carries no dimensions, so it can't drive orientation.
  if (project.images && project.images.length > 0) {
    // Honor the admin-selected cover image when one is set and present in
    // images[]; orientation follows that image so the card matches the cover.
    const cover = project.coverMediaId
      ? project.images.find((img) => img.mediaId === project.coverMediaId)
      : undefined;
    const chosen = cover ?? project.images[0];
    return {
      url: chosen.blobKey ?? project.image ?? null,
      portrait: isPortraitImage(chosen),
    };
  }
  if (project.image) return { url: project.image, portrait: false };
  return { url: null, portrait: false };
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const { language, t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || isPaused || projects.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [emblaApi, isPaused, projects.length]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      setIsPaused(true);
    },
    [emblaApi]
  );

  if (projects.length === 0) {
    return (
      <div className="mt-12 text-center md:hidden">
        <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-[13px] text-[color:var(--ink-muted)]">
            {language === "es"
              ? "No hay proyectos disponibles"
              : language === "it"
                ? "Nessun progetto disponibile"
                : "No projects available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-12 md:hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {projects.map((project) => {
            const content = getProjectContent(project, language);
            const thumb = getProjectThumb(project);
            const image = thumb.url;
            const preset = resolveProjectGradient(
              project.gradientPreset,
              project.gradientFrom,
              project.gradientTo,
            );

            return (
              <div key={project.id} className="flex-[0_0_100%] min-w-0 px-1.5">
                <Link href={`/projects/${project.id}`} className="block">
                  <article
                    className={`relative overflow-hidden rounded-2xl aspect-[4/3] bg-center border border-[color:var(--ink-line)] ${
                      thumb.portrait ? "" : "bg-cover"
                    }`}
                    style={{
                      backgroundImage:
                        !thumb.portrait && image
                          ? `url(${image})`
                          : preset.background,
                    }}
                  >
                    {thumb.portrait && image && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center blur-2xl scale-125"
                          style={{ backgroundImage: `url(${image})` }}
                        />
                        <div
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${image})` }}
                        />
                      </>
                    )}
                    <div
                      className="absolute inset-0 z-[1]"
                      style={{ background: preset.overlay }}
                    />
                    <div className="absolute left-5 right-5 bottom-5 z-[2] flex flex-col items-start gap-2">
                      <Capsule size="sm" dot={false}>
                        {getCategoryLabel(project.category, t)}
                      </Capsule>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">
                        {content.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {projects.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to project ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-6 bg-[color:var(--brand-cyan)]"
                  : "w-1.5 bg-[color:var(--ink-line)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
