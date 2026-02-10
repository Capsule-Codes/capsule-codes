import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import {
  processAndUploadImages,
  deleteImageFromAzure,
} from "@/lib/server/media";

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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectHighlightId } = await params;
    const form = await req.formData();
    const files: File[] = [];
    for (const [key, value] of form.entries()) {
      if (key === "images" && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No images provided" },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Database not configured" },
        { status: 500 },
      );
    }

    const { data: projectHighlight, error: fetchError } = await supabaseAdmin
      .from("project_highlights")
      .select("images")
      .eq("id", projectHighlightId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { message: "Case study not found" },
        { status: 404 },
      );
    }

    const currentImages = (projectHighlight.images as any[]) || [];

    if (currentImages.length + files.length > MAX_IMAGES) {
      return NextResponse.json(
        { message: `Maximum ${MAX_IMAGES} images allowed per case study` },
        { status: 400 },
      );
    }

    for (const f of files) {
      if (!ALLOWED_MIME.has(f.type)) {
        return NextResponse.json(
          { message: `Invalid image format: ${f.name}` },
          { status: 400 },
        );
      }
    }

    const altText = (form.get("altText") as string) || "Case study image";

    const uploadedImages = await processAndUploadImages(
      projectHighlightId,
      files,
      currentImages.length,
      altText,
    );

    const updatedImages = [...currentImages, ...uploadedImages];

    const { error: updateError } = await supabaseAdmin
      .from("project_highlights")
      .update({ images: updatedImages })
      .eq("id", projectHighlightId);

    if (updateError) {
      return NextResponse.json(
        { message: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        images: uploadedImages,
        partialSuccess: uploadedImages.length < files.length,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Error uploading images:", err);
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
    const { id: projectHighlightId } = await params;
    const { searchParams } = new URL(req.url);
    const blobKey = searchParams.get("blobKey");
    const mediaId = searchParams.get("mediaId");

    if (!blobKey) {
      return NextResponse.json(
        { message: "blobKey parameter is required" },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Database not configured" },
        { status: 500 },
      );
    }

    const { data: projectHighlight, error: fetchError } = await supabaseAdmin
      .from("project_highlights")
      .select("images")
      .eq("id", projectHighlightId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { message: "Case study not found" },
        { status: 404 },
      );
    }

    const currentImages = (projectHighlight.images as any[]) || [];
    const updatedImages = currentImages.filter(
      (img: any) => img.mediaId !== mediaId,
    );

    await deleteImageFromAzure(blobKey);

    const { error: updateError } = await supabaseAdmin
      .from("project_highlights")
      .update({ images: updatedImages })
      .eq("id", projectHighlightId);

    if (updateError) {
      return NextResponse.json(
        { message: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        deletedBlobKey: blobKey,
        deletedMediaId: mediaId,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error deleting image:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
