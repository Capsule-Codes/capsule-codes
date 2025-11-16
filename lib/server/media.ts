import "server-only";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { getContainerClient } from "@/lib/azure";

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

export async function processAndUploadImage(
  projectId: string,
  file: File,
  sortOrder: number,
  altText: string = "Project image"
): Promise<MediaItem> {
  try {
    const arrayBuf = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuf);

    // Image optimization with sharp
    const optimized = await sharp(inputBuffer)
      .rotate() // Auto-rotate based on EXIF
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const meta = await sharp(optimized).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;

    const assetId = randomUUID();
    const mediaId = randomUUID();
    const fileName = `${assetId}_1600.webp`;
    const blobKey = `capsulecodes/projects/${projectId}/optimized/${fileName}`;

    // Upload to Azure
    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(blobKey);
    await blobClient.uploadData(optimized, {
      blobHTTPHeaders: {
        blobContentType: "image/webp",
        blobCacheControl: "public, max-age=31536000, immutable",
      },
    });

    return {
      mediaId,
      blobKey,
      mimeType: "image/webp",
      width,
      height,
      sizeBytes: optimized.length,
      alt: altText,
      sortOrder,
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error("Image processing/upload error:", (e as any)?.message || e);
    throw e;
  }
}

export async function processAndUploadImages(
  projectId: string,
  files: File[],
  startIndex: number,
  altDefault: string = "Project image"
): Promise<MediaItem[]> {
  const newItems: MediaItem[] = [];
  let sortIndex = startIndex;

  for (const file of files) {
    try {
      const item = await processAndUploadImage(
        projectId,
        file,
        sortIndex++,
        altDefault
      );
      newItems.push(item);
    } catch (e) {
      console.error("Image processing/upload error:", (e as any)?.message || e);
      // Continue with other images even if one fails
      continue;
    }
  }

  return newItems;
}

export async function deleteImageFromAzure(blobKey: string): Promise<void> {
  try {
    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(blobKey);
    await blobClient.deleteIfExists();
  } catch (e) {
    console.error("Error deleting image from Azure:", (e as any)?.message || e);
    throw e;
  }
}

export async function getImageFromAzure(
  blobKey: string,
  req: Request
): Promise<Response> {
  try {
    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(blobKey);

    const props = await blobClient.getProperties();
    const etag = props.etag || undefined;
    const length = props.contentLength || undefined;

    // Check ETag for caching
    const ifNoneMatch = req.headers.get("if-none-match");
    if (etag && ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, { status: 304 });
    }

    const download = await blobClient.download();
    const body = download.readableStreamBody as any;

    const headers = new Headers();
    headers.set("Content-Type", "image/webp");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (length !== undefined) headers.set("Content-Length", String(length));
    if (etag) headers.set("ETag", etag);

    return new Response(body, { status: 200, headers });
  } catch (e) {
    console.error("Error fetching image from Azure:", (e as any)?.message || e);
    throw e;
  }
}
