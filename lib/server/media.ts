import "server-only";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "./supabase-admin";

export type MediaFolder = "projects" | "reviews" | "team";

export interface MediaItem {
  mediaId: string;
  blobKey: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  alt: string;
  sortOrder: number;
  createdAt: string;
}

const BUCKET = "images";
const CACHE_CONTROL = "31536000"; // 1 year (seconds, supabase format)

function assertAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      "supabaseAdmin not configured (SUPABASE_SERVICE_ROLE_KEY missing)"
    );
  }
}

/**
 * Resize/optimize an image buffer to a 1600-wide webp.
 */
async function optimizeProjectImage(input: Buffer) {
  const optimized = await sharp(input)
    .rotate() // EXIF auto-rotate
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const meta = await sharp(optimized).metadata();
  return {
    buffer: optimized,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
  };
}

/**
 * Resize/optimize an avatar to a 400x400 square webp.
 */
async function optimizeAvatar(input: Buffer) {
  const optimized = await sharp(input)
    .rotate()
    .resize({ width: 400, height: 400, fit: "cover" })
    .webp({ quality: 85 })
    .toBuffer();

  const meta = await sharp(optimized).metadata();
  return {
    buffer: optimized,
    width: meta.width ?? 400,
    height: meta.height ?? 400,
  };
}

/**
 * Upload a raw buffer to the Supabase Storage `images` bucket and return its
 * public URL. Internal helper.
 */
async function uploadBuffer(
  path: string,
  buffer: Buffer,
  contentType = "image/webp"
): Promise<string> {
  assertAdmin();
  const { error } = await supabaseAdmin!.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      cacheControl: CACHE_CONTROL,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Failed to upload to Supabase Storage (path=${path}): ${error.message}`
    );
  }

  const { data } = supabaseAdmin!.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Process a File upload, optimize as a project image, upload to Supabase
 * Storage and return a `MediaItem` describing it.
 *
 * The `blobKey` field of the returned MediaItem stores the **public URL** so
 * that frontends can render images directly without a proxy. The storage path
 * (used for deletion) is `${folder}/${entityId}/${assetId}.webp`.
 */
export async function processAndUploadImage(
  entityId: string,
  file: File,
  sortOrder: number,
  altText: string = "Project image",
  folder: MediaFolder = "projects"
): Promise<MediaItem> {
  try {
    const arrayBuf = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuf);

    const { buffer: optimized, width, height } = await optimizeProjectImage(
      inputBuffer
    );

    const assetId = randomUUID();
    const mediaId = randomUUID();
    const path = `${folder}/${entityId}/${assetId}.webp`;

    const publicUrl = await uploadBuffer(path, optimized, "image/webp");

    return {
      mediaId,
      blobKey: publicUrl,
      mimeType: "image/webp",
      width,
      height,
      sizeBytes: optimized.length,
      alt: altText,
      sortOrder,
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error(
      "Image processing/upload error:",
      (e as any)?.message || e
    );
    throw e;
  }
}

/**
 * Batch variant. Continues on per-image failure.
 */
export async function processAndUploadImages(
  entityId: string,
  files: File[],
  startIndex: number,
  altDefault: string = "Project image",
  folder: MediaFolder = "projects"
): Promise<MediaItem[]> {
  const newItems: MediaItem[] = [];
  let sortIndex = startIndex;

  for (const file of files) {
    try {
      const item = await processAndUploadImage(
        entityId,
        file,
        sortIndex++,
        altDefault,
        folder
      );
      newItems.push(item);
    } catch (e) {
      console.error(
        "Image processing/upload error:",
        (e as any)?.message || e
      );
      continue;
    }
  }

  return newItems;
}

/**
 * Process a File as an avatar (square, 400px), upload to Supabase Storage,
 * and return the public URL plus the storage path (for later deletion).
 */
export async function processAndUploadAvatar(
  entityId: string,
  file: File,
  folder: MediaFolder = "reviews"
): Promise<{ avatarUrl: string; path: string }> {
  const arrayBuf = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuf);
  const { buffer: optimized } = await optimizeAvatar(inputBuffer);

  const assetId = randomUUID();
  const path = `${folder}/${entityId}/${assetId}.webp`;

  const avatarUrl = await uploadBuffer(path, optimized, "image/webp");
  return { avatarUrl, path };
}

/**
 * Derive a storage path inside the `images` bucket from whatever the caller
 * passes (full public URL, /api/images/... legacy path, or already a bare
 * storage path). Returns null if it can't be derived.
 */
export function deriveStoragePath(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Full Supabase public URL
  const publicMarker = "/storage/v1/object/public/images/";
  const idx = trimmed.indexOf(publicMarker);
  if (idx !== -1) {
    return trimmed.slice(idx + publicMarker.length);
  }

  // Legacy /api/images/<blobKey> proxy path
  if (trimmed.startsWith("/api/images/")) {
    return trimmed.slice("/api/images/".length);
  }

  // Already looks like a storage path (no protocol, no leading slash on api)
  if (!trimmed.includes("://") && !trimmed.startsWith("/")) {
    return trimmed;
  }

  return null;
}

/**
 * Delete an image from Supabase Storage by storage path (or a value we can
 * derive a path from).
 */
export async function deleteImageFromStorage(
  pathOrUrl: string
): Promise<void> {
  assertAdmin();
  const path = deriveStoragePath(pathOrUrl);
  if (!path) {
    console.warn(
      `deleteImageFromStorage: could not derive storage path from "${pathOrUrl}", skipping`
    );
    return;
  }

  const { error } = await supabaseAdmin!.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error(
      "Error deleting image from Supabase Storage:",
      error.message
    );
    throw error;
  }
}
