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

export type GalleryTile = "featured" | "third" | "half" | "full";

/**
 * Desktop/landscape gallery tiles on a 6-column grid, chosen so every row is
 * complete: one shot is full width; 2 and 4 are halves; from 3 the first shot
 * is featured (4 cols x 2 rows) beside two thirds, then thirds, with the last
 * 2 or 4 shots as halves when the thirds would leave an orphan.
 */
export function desktopGalleryLayout(count: number): GalleryTile[] {
  if (count <= 0) return [];
  if (count === 1) return ["full"];
  if (count === 2 || count === 4) return Array<GalleryTile>(count).fill("half");
  const tiles: GalleryTile[] = ["featured", "third", "third"];
  const rest = count - 3;
  const halves = rest % 3 === 1 ? 4 : rest % 3 === 2 ? 2 : 0;
  for (let i = 0; i < rest - halves; i++) tiles.push("third");
  for (let i = 0; i < halves; i++) tiles.push("half");
  return tiles;
}
