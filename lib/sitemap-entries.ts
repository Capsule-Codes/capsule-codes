import { absoluteUrl } from "./site.ts";
import { LOCALES, alternateUrls, localePath, type Locale } from "./locale.ts";

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency: "monthly" | "yearly";
  priority: number;
  alternates: { languages: Record<Locale | "x-default", string> };
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** One entry per locale for a page, each listing all the language alternates. */
function pageEntries(
  path: string,
  fields: Omit<SitemapEntry, "url" | "alternates">,
): SitemapEntry[] {
  const alternates = { languages: alternateUrls(path) };
  return LOCALES.map((locale) => ({
    url: absoluteUrl(localePath(locale, path)),
    ...fields,
    alternates,
  }));
}

/**
 * Static pages get a fixed date (the time the process built the sitemap's
 * module, passed in), projects get their own `updatedAt`, or no lastmod.
 * Every page is listed in all locales with hreflang alternates.
 */
export function buildSitemapEntries(
  projects: { id: string; updatedAt?: string }[],
  staticLastModified: Date,
): SitemapEntry[] {
  return [
    ...pageEntries("/", { lastModified: staticLastModified, changeFrequency: "monthly", priority: 1 }),
    ...pageEntries("/projects", { lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 }),
    ...projects.flatMap((p) => {
      const lastModified = parseDate(p.updatedAt);
      return pageEntries(`/projects/${p.id}`, {
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }),
    ...pageEntries("/privacy", { lastModified: staticLastModified, changeFrequency: "yearly", priority: 0.3 }),
    ...pageEntries("/terms", { lastModified: staticLastModified, changeFrequency: "yearly", priority: 0.3 }),
  ];
}
