import type { Project } from "./data-context.tsx";
import { getProjectCover } from "./project-media.ts";
import { absoluteUrl } from "./site.ts";

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

export interface ProjectPageMetadata {
  title: string;
  description: string;
  alternates: { canonical: string };
  openGraph: {
    type: "website";
    title: string;
    description: string;
    url: string;
    images?: { url: string; alt: string }[];
  };
  twitter: { card: "summary_large_image"; title: string; description: string; images?: string[] };
}

/** Server-side metadata (English: the site has no locale routes). Cover = OG image. */
export function buildProjectMetadata(
  project: Pick<Project, "id" | "title" | "description" | "image"> &
    Partial<Pick<Project, "translations">>,
): ProjectPageMetadata {
  const en = project.translations?.en;
  const title = en?.title || project.title;
  const description = truncate(en?.description || project.description || "", MAX_DESCRIPTION);
  const cover = getProjectCover(project);
  const path = absoluteUrl(`/projects/${project.id}`);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      ...(cover ? { images: [{ url: cover, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}
