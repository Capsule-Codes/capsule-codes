import type { Project } from "./data-context.tsx";
import { getProjectCover } from "./project-media.ts";
import { buildLocalizedMetadata, type LocalizedMetadata } from "./page-metadata.ts";
import type { Locale } from "./locale.ts";
import { getCaseStudyLocale } from "./case-study.ts";

const MAX_DESCRIPTION = 200;

/** Public pages only expose projects explicitly marked as published. */
export function isProjectPublished(project: Pick<Project, "published">): boolean {
  return project.published === true;
}

/** All published projects. `showOnHome` only curates the home, not the index. */
export function getPublishedProjects<T extends Pick<Project, "published">>(projects: T[]): T[] {
  return projects.filter(isProjectPublished);
}

export function findPublishedProject<T extends Pick<Project, "id" | "published">>(
  projects: T[],
  id: string,
): T | null {
  return getPublishedProjects(projects).find((p) => p.id === id) ?? null;
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Next published project after `id` in list order (the index order), wrapping
 * around. Null when there is no other published project.
 */
export function getNextProject<T extends Pick<Project, "id" | "published">>(
  projects: T[],
  id: string,
): T | null {
  const published = getPublishedProjects(projects);
  const others = published.filter((p) => p.id !== id);
  if (others.length === 0) return null;
  const index = published.findIndex((p) => p.id === id);
  if (index === -1) return others[0];
  return published[(index + 1) % published.length];
}

/**
 * Subtitle for a locale: the case study subtitle, else the localized value,
 * else the project's top-level `subtitle` column (English-only in practice),
 * else undefined.
 */
export function resolveProjectSubtitle(
  project: Partial<Pick<Project, "translations" | "subtitle" | "caseStudy">>,
  language: "en" | "es" | "it",
): string | undefined {
  const fromCaseStudy = getCaseStudyLocale(project.caseStudy, language)?.subtitle;
  if (fromCaseStudy) return fromCaseStudy;
  const localized = project.translations?.[language]?.subtitle?.trim();
  if (localized) return localized;
  return project.subtitle?.trim() || undefined;
}

/**
 * Server-side metadata for a project page in a locale. The case study (subtitle
 * in the title, summary as description) wins, then the localized copy, then
 * English, then the base columns. Cover = OG image.
 */
export function buildProjectMetadata(
  project: Pick<Project, "id" | "title" | "description" | "image"> &
    Partial<Pick<Project, "translations" | "caseStudy">>,
  locale: Locale = "en",
): LocalizedMetadata {
  const localized = project.translations?.[locale];
  const en = project.translations?.en;
  const caseStudy = getCaseStudyLocale(project.caseStudy, locale);
  const name = localized?.title || en?.title || project.title;
  const title = caseStudy ? `${name} — ${caseStudy.subtitle}` : name;
  const description = truncate(
    caseStudy?.summary ||
      localized?.description ||
      en?.description ||
      project.description ||
      "",
    MAX_DESCRIPTION,
  );
  return buildLocalizedMetadata({
    locale,
    path: `/projects/${project.id}`,
    title,
    description,
    image: getProjectCover(project) || undefined,
  });
}
