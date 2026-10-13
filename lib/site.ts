/**
 * Single source of truth for the public origin. Production redirects the apex
 * domain to www, so every canonical, OG URL, sitemap and robots entry uses it.
 */
export const SITE_URL = "https://www.capsulecodes.com";

/** Absolute URL for a site path ("" or "/" is the origin itself). */
export function absoluteUrl(path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${SITE_URL}/${clean}` : SITE_URL;
}
