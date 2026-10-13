import { absoluteUrl } from "./site.ts";

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency: "monthly" | "yearly";
  priority: number;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * Static pages get a fixed date (the time the process built the sitemap's
 * module, passed in), projects get their own `updatedAt`, or no lastmod.
 */
export function buildSitemapEntries(
  projects: { id: string; updatedAt?: string }[],
  staticLastModified: Date,
): SitemapEntry[] {
  return [
    { url: absoluteUrl("/"), lastModified: staticLastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projects"), lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => {
      const lastModified = parseDate(p.updatedAt);
      return {
        url: absoluteUrl(`/projects/${p.id}`),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
    { url: absoluteUrl("/privacy"), lastModified: staticLastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: staticLastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
