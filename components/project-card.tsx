"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { useLanguage, useLocalePath } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";
import { resolveProjectGradient } from "@/lib/gradient-presets";
import { SiteImage } from "@/components/site-image";
import { getProjectThumb } from "@/lib/project-media";
import { getCategoryLabel, getProjectContent } from "@/components/projects-carousel";

/** Grid on the projects page: 1 column on phones, 2 from md, 3 from lg (max container 1280px). */
const CARD_SIZES = "(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

/** Card for a project: 16:10 marketing cover, title, summary and a link to the detail page. */
export function ProjectCard({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const localePath = useLocalePath();
  const content = getProjectContent(project, language);
  const thumb = getProjectThumb(project);
  const preset = resolveProjectGradient(
    project.gradientPreset,
    project.gradientFrom,
    project.gradientTo,
  );

  return (
    <Link
      href={localePath(`/projects/${project.id}`)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] transition-colors duration-200 hover:border-[color:var(--brand-cyan)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--ink-line)]"
        style={{ background: preset.background }}
      >
        {thumb.url &&
          (thumb.portrait ? (
            <>
              {/* Blurred backdrop: the blur hides detail, so a tiny size is enough. */}
              <SiteImage src={thumb.url} alt="" aria-hidden fill sizes="96px" className="scale-125 object-cover blur-2xl" />
              <SiteImage src={thumb.url} alt={content.title} fill sizes={CARD_SIZES} className="object-contain" />
            </>
          ) : (
            <SiteImage
              src={thumb.url}
              alt={content.title}
              fill
              sizes={CARD_SIZES}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 lg:p-6">
        <div>
          <Capsule size="sm" dot={false}>
            {getCategoryLabel(project.category, t)}
          </Capsule>
        </div>
        <h3 className="text-xl font-semibold tracking-[-0.02em]">{content.title}</h3>
        {content.subtitle && (
          <p className="line-clamp-3 text-sm leading-[1.6] text-[color:var(--ink-muted)]">
            {content.subtitle}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-[color:var(--brand-cyan)]">
          {t.projects.viewProject}
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
