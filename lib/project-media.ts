import type { Project, ProjectImage } from "./data-context.tsx";

/**
 * Project media model:
 *  - `project.image`  -> marketing cover (16:10). Used on cards/thumbnails and
 *                        as the detail-page hero banner. Never in a device frame.
 *  - `project.images` -> screenshots only. Used by carousels and the gallery.
 */
type MediaProject = Pick<Project, "image"> &
  Partial<Pick<Project, "images" | "coverMediaId">>;

export function isPortraitImage(
  img?: { width?: number; height?: number } | null,
): boolean {
  return !!img?.width && !!img?.height && img.height > img.width;
}

export function getProjectCover(project: Pick<Project, "image">): string | null {
  return project.image ? project.image : null;
}

/** Screenshots sorted by sortOrder, with any entry equal to the cover removed. */
export function getProjectScreenshots(project: MediaProject): ProjectImage[] {
  const cover = getProjectCover(project);
  return [...(project.images ?? [])]
    .filter((img) => !cover || img.blobKey !== cover)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export interface ProjectThumb {
  url: string | null;
  portrait: boolean;
  /** True when `url` is the dedicated 16:10 marketing cover. */
  isCover: boolean;
}

export function getProjectThumb(project: MediaProject): ProjectThumb {
  const images = project.images ?? [];
  const cover = getProjectCover(project);
  if (cover) {
    // Legacy data: `image` may mirror a screenshot; keep that screenshot's
    // orientation so portrait shots are not cropped into a landscape card.
    const mirrored = images.find((img) => img.blobKey === cover);
    return { url: cover, portrait: isPortraitImage(mirrored), isCover: !mirrored };
  }
  if (images.length > 0) {
    const selected = project.coverMediaId
      ? images.find((img) => img.mediaId === project.coverMediaId)
      : undefined;
    const chosen = selected ?? [...images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
    return {
      url: chosen.blobKey ?? null,
      portrait: isPortraitImage(chosen),
      isCover: false,
    };
  }
  return { url: null, portrait: false, isCover: false };
}

/**
 * Value for `projects.image` on admin saves. The cover is managed outside the
 * screenshots, so never overwrite an existing one. Only when it is empty (or
 * pointed at a screenshot that was just removed) fall back to a screenshot.
 */
export function resolvePrimaryImage(
  currentImage: string,
  screenshots: Pick<ProjectImage, "blobKey">[],
  removedBlobKey?: string,
): string {
  const stale = !!removedBlobKey && currentImage === removedBlobKey;
  if (currentImage && !stale) return currentImage;
  return screenshots[0]?.blobKey ?? "";
}
