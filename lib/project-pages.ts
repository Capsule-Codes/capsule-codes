import type { Project } from "./data-context.tsx";
import { getProjectCover } from "./project-media.ts";
import { buildLocalizedMetadata, type LocalizedMetadata } from "./page-metadata.ts";
import type { Locale } from "./locale.ts";

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
 * Subtitle for a locale: the localized value, else the project's top-level
 * `subtitle` column (some projects only fill that one), else undefined.
 */
export function resolveProjectSubtitle(
  project: Partial<Pick<Project, "translations" | "subtitle">>,
  language: "en" | "es" | "it",
): string | undefined {
  const localized = project.translations?.[language]?.subtitle?.trim();
  if (localized) return localized;
  return project.subtitle?.trim() || undefined;
}

/**
 * Server-side metadata for a project page in a locale. The localized copy wins,
 * then English, then the base columns. Cover = OG image.
 */
export function buildProjectMetadata(
  project: Pick<Project, "id" | "title" | "description" | "image"> &
    Partial<Pick<Project, "translations">>,
  locale: Locale = "en",
): LocalizedMetadata {
  const localized = project.translations?.[locale];
  const en = project.translations?.en;
  const title = localized?.title || en?.title || project.title;
  const description = truncate(
    localized?.description || en?.description || project.description || "",
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
