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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: memberId } = await params;
    const form = await req.formData();
    const file = form.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No avatar provided" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { message: `Invalid image format: ${file.name}` },
        { status: 400 },
      );
    }

    const arrayBuf = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuf);

    const optimized = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 400, height: 400, fit: "cover" })
      .webp({ quality: 85 })
      .toBuffer();

    const avatarId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const blobKey = `capsulecodes/team/avatars/${memberId}/${avatarId}_400.webp`;

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
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Error uploading team member avatar:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const blobKey = searchParams.get("blobKey");

    if (!blobKey) {
      return NextResponse.json(
        { message: "blobKey parameter is required" },
        { status: 400 },
      );
    }

    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(blobKey);
    await blobClient.delete();

    return NextResponse.json(
      {
        ok: true,
        deletedBlobKey: blobKey,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error deleting team member avatar:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
