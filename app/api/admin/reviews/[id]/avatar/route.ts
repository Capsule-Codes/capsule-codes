import { NextResponse } from "next/server";
import { getContainerClient } from "@/lib/azure";
import sharp from "sharp";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
    const form = await req.formData();
    const file = form.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No avatar provided" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { message: `Invalid image format: ${file.name}` },
        { status: 400 }
      );
    }

    // Process image
    const arrayBuf = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuf);

    // Optimize avatar (smaller size, circular crop works better with square images)
    const optimized = await sharp(inputBuffer)
      .rotate() // Auto-rotate based on EXIF
      .resize({ width: 400, height: 400, fit: "cover" }) // Square avatar
      .webp({ quality: 85 })
      .toBuffer();

    const avatarId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const blobKey = `capsulecodes/reviews/avatars/${reviewId}/${avatarId}_400.webp`;

    // Upload to Azure
    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(blobKey);
    await blobClient.uploadData(optimized, {
      blobHTTPHeaders: {
        blobContentType: "image/webp",
        blobCacheControl: "public, max-age=31536000, immutable",
      },
    });

    const avatarUrl = `/api/images/${blobKey}`;

    return NextResponse.json(
      {
        ok: true,
        avatarUrl,
        blobKey,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error uploading avatar:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const blobKey = searchParams.get("blobKey");

    if (!blobKey) {
      return NextResponse.json(
        { message: "blobKey parameter is required" },
        { status: 400 }
      );
    }

    // Delete from Azure
    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(blobKey);
    await blobClient.delete();

    return NextResponse.json(
      {
        ok: true,
        deletedBlobKey: blobKey,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting avatar:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
