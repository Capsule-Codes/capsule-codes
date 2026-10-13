/**
 * Which image sources `next/image` may optimize. Sources outside the
 * `remotePatterns` in `next.config.mjs` make `next/image` throw, so anything
 * else (legacy external URLs, data/blob URLs) must be rendered `unoptimized`.
 * Keep in sync with `images.remotePatterns`.
 */
const STORAGE_PATH_PREFIX = "/storage/v1/object/public/";

export function canOptimizeImage(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("//")) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.startsWith(STORAGE_PATH_PREFIX)
    );
  } catch {
    return false;
  }
}
