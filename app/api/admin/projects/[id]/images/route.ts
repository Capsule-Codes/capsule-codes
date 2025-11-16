import { NextResponse } from "next/server";
import { processAndUploadImages, deleteImageFromAzure } from "@/lib/server/media";
import type { ProjectImage } from "@/lib/data-context";

const MAX_IMAGES = 10;
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
    const { id: projectId } = await params;
    const form = await req.formData();

    // Collect files
    const files: File[] = [];
    for (const [key, value] of form.entries()) {
      if (key === "images" && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No images provided" },
        { status: 400 }
      );
    }

    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { message: `Maximum ${MAX_IMAGES} images allowed` },
        { status: 400 }
      );
    }

    // Validate MIME types
    for (const f of files) {
      if (!ALLOWED_MIME.has(f.type)) {
        return NextResponse.json(
          { message: `Invalid image format: ${f.name}` },
          { status: 400 }
        );
      }
    }

    // Get alt text from form or use default
    const altText = (form.get("altText") as string) || "Project image";

    // Process and upload images
    const uploadedImages = await processAndUploadImages(
      projectId,
      files,
      0,
      altText
    );

    return NextResponse.json(
      {
        ok: true,
        images: uploadedImages,
        partialSuccess: uploadedImages.length < files.length,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error uploading images:", err);
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
    const mediaId = searchParams.get("mediaId");

    if (!blobKey) {
      return NextResponse.json(
        { message: "blobKey parameter is required" },
        { status: 400 }
      );
    }

    // Delete from Azure
    await deleteImageFromAzure(blobKey);

    return NextResponse.json(
      {
        ok: true,
        deletedBlobKey: blobKey,
        deletedMediaId: mediaId,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting image:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
