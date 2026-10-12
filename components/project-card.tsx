"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { useLanguage } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";
import { resolveProjectGradient } from "@/lib/gradient-presets";
import { getProjectThumb } from "@/lib/project-media";
import { getCategoryLabel, getProjectContent } from "@/components/projects-carousel";

/** Card for a project: 16:10 marketing cover, title, summary and a link to the detail page. */
export function ProjectCard({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const content = getProjectContent(project, language);
  const thumb = getProjectThumb(project);
  const preset = resolveProjectGradient(
    project.gradientPreset,
    project.gradientFrom,
    project.gradientTo,
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] transition-colors duration-200 hover:border-[color:var(--brand-cyan)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--ink-line)]"
        style={{ background: preset.background }}
      >
        {thumb.url &&
          (thumb.portrait ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb.url} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb.url} alt={content.title} className="absolute inset-0 h-full w-full object-contain" />
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb.url}
              alt={content.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
