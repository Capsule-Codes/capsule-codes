/**
 * Pure helpers for the admin "Cover" control. The cover lives in
 * `projects.image` (16:10, 1600x1000 WebP) and is managed separately from the
 * screenshot gallery (`images[]`). See lib/project-media.ts.
 */
export const COVER_WIDTH = 1600;
export const COVER_HEIGHT = 1000;
export const MAX_COVER_BYTES = 10 * 1024 * 1024;

const SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/;

/** 8 hex chars taken from a uuid, e.g. `fd47533e`. */
export function coverShortId(uuid: string): string {
  return uuid.replace(/-/g, "").slice(0, 8);
}

/** Storage path inside the `images` bucket. Always unique per upload. */
export function buildCoverPath(projectId: string, shortId: string): string {
  if (!SAFE_SEGMENT.test(projectId) || !SAFE_SEGMENT.test(shortId)) {
    throw new Error("Invalid cover path segment");
  }
  return `projects/${projectId}/cover-${shortId}.webp`;
}

const ALLOWED_COVER_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type CoverValidation = { ok: true } | { ok: false; message: string };

export function validateCoverFile(file: {
  type: string;
  size: number;
}): CoverValidation {
  if (!ALLOWED_COVER_MIME.has(file.type)) {
    return { ok: false, message: "Cover must be a JPEG, PNG, WebP or GIF image" };
  }
  if (file.size <= 0) return { ok: false, message: "Cover file is empty" };
  if (file.size > MAX_COVER_BYTES) {
    return {
      ok: false,
      message: `Cover must be under ${MAX_COVER_BYTES / 1024 / 1024} MB`,
    };
  }
  return { ok: true };
}

/**
 * Project patch for a cover change. Only ever `image`: never `images[]` and
 * never `coverMediaId`. `null` clears the cover. The old storage object is
 * intentionally left in place.
 */
export function buildCoverPatch(url: string | null): { image: string } {
  return { image: url ?? "" };
}
