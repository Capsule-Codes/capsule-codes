import { NextResponse } from "next/server";
import {
  processAndUploadAvatar,
  deleteImageFromStorage,
} from "@/lib/server/media";

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

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { message: `Invalid image format: ${file.name}` },
        { status: 400 }
      );
    }

    const { avatarUrl, path } = await processAndUploadAvatar(
      reviewId,
      file,
      "reviews"
    );

    return NextResponse.json(
      {
        ok: true,
        avatarUrl,
        // Kept under `blobKey` for backward-compat with any existing caller.
        blobKey: path,
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
  { params: _params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const blobKey =
      searchParams.get("blobKey") || searchParams.get("path");

    if (!blobKey) {
      return NextResponse.json(
        { message: "blobKey parameter is required" },
        { status: 400 }
      );
    }

    await deleteImageFromStorage(blobKey);

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
