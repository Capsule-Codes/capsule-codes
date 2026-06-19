"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectLightbox } from "@/components/project-lightbox";
import { useLanguage } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";
import { resolveProjectGradient } from "@/lib/gradient-presets";
import { getProjectContent } from "@/components/projects-carousel";
import { ProjectsList } from "./projects-list";
import {
  ProjectScreenshotCarousel,
  type CarouselImage,
} from "./project-screenshot-carousel";

interface ProjectsShowcaseSectionProps {
  projects?: Project[];
}

function getProjectImages(project: Project): CarouselImage[] {
  if (project.images && project.images.length > 0) {
    return [...project.images]
      .sort((a, b) => {
        const aIsCover = a.mediaId === project.coverMediaId ? -1 : 0;
        const bIsCover = b.mediaId === project.coverMediaId ? -1 : 0;
        if (aIsCover !== bIsCover) return aIsCover - bIsCover;
        return a.sortOrder - b.sortOrder;
      })
      .map((img, index) => ({
        src: img.blobKey,
        alt: img.alt || `${project.title} - ${index + 1}`,
      }));
  }
  if (project.image) {
    return [{ src: project.image, alt: project.title }];
  }
  return [];
}

export function ProjectsShowcaseSection({
  projects: projectsProp,
}: ProjectsShowcaseSectionProps = {}) {
  const { t, language } = useLanguage();

  const projects = (projectsProp ?? []).filter(
    (p) => p.published === true && p.showOnHome !== false,
  );

  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const active = projects.find((p) => p.id === activeId) ?? projects[0] ?? null;

  const images = useMemo(() => (active ? getProjectImages(active) : []), [active]);

  const titleWords = t.projects.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const leadingWords = titleWords.slice(0, -1).join(" ");

  const header = (
    <SectionHeader
      eyebrow="— 05 / Projects"
      title={
        <>
          {leadingWords}
          {leadingWords && " "}
          <em className="not-italic text-brand-grad">{lastWord}</em>
        </>
      }
      lead={t.projects.subtitle}
    />
  );

  if (!active) {
    return (
      <section
        id="projects"
        className="border-t border-[color:var(--ink-line)] px-4 py-[90px] lg:px-12"
      >
        {header}
        <div className="mt-12 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] p-6">
            <p className="text-[13px] text-[color:var(--ink-muted)]">
              {language === "es"
                ? "No hay proyectos disponibles"
                : language === "it"
                  ? "Nessun progetto disponibile"
                  : "No projects available"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const content = getProjectContent(active, language);
  const preset = resolveProjectGradient(
    active.gradientPreset,
    active.gradientFrom,
    active.gradientTo,
  );
  const orientation = active.imageOrientation ?? (active.category === "mobile" ? "vertical" : "horizontal");
  const frame = orientation === "vertical" ? "phone" : "browser";
  const viewLabel =
    language === "es" ? "Ver proyecto" : language === "it" ? "Vedi progetto" : "View project";

  return (
    <section
      id="projects"
      className="border-t border-[color:var(--ink-line)] px-4 py-[90px] lg:px-12"
    >
      {header}

      <div className="mt-12 grid overflow-hidden rounded-3xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] md:grid-cols-[380px_1fr] lg:mt-14">
        <ProjectsList projects={projects} activeId={active.id} onSelect={setActiveId} />

        <div className="relative grid gap-7 p-6 md:p-9">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-50"
            style={{ background: "radial-gradient(circle, var(--brand-cyan), transparent 67%)" }}
          />
          <div className="relative grid min-h-[440px] place-items-center overflow-hidden rounded-3xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg)] p-6">
            <ProjectScreenshotCarousel
              key={active.id}
              images={images}
              frame={frame}
              emptyBackground={preset.background}
              onOpenLightbox={(i) => setLightboxIndex(i)}
            />
          </div>

          <div className="relative grid items-end gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="mb-3 text-3xl font-semibold tracking-[-0.03em]">{content.title}</h3>
              {content.description && (
                <p className="max-w-[560px] leading-[1.7] text-[color:var(--ink-muted)]">
                  {content.description}
                </p>
              )}
              {/* <Link
                href={`/projects/${active.id}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--brand-cyan)] transition-opacity hover:opacity-80"
              >
                {viewLabel}
                <ArrowUpRight className="size-4" />
              </Link> */}
            </div>

            {active.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {active.technologies.slice(0, 4).map((tech) => (
                  <Capsule key={tech} size="sm" dot={false}>
                    {tech}
                  </Capsule>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <ProjectLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}
