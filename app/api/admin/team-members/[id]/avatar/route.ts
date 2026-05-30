import { NextResponse } from "next/server";
import {
  processAndUploadAvatar,
  deleteImageFromStorage,
} from "@/lib/server/media";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

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
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { id: memberId } = await params;
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
      memberId,
      file,
      "team"
    );

    // Persist directly so callers can refresh state without an extra PUT.
    const { error: updateError } = await supabaseAdmin
      .from("team_members")
      .update({
        avatar: avatarUrl,
        avatar_blob_key: path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);

    if (updateError) {
      console.error(
        "Error updating team_members.avatar after upload:",
        updateError
      );
      // Still return the URL — caller can decide how to recover.
    }

    return NextResponse.json(
      {
        ok: true,
        avatarUrl,
        avatar_blob_key: path,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error uploading team avatar:", err);
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
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { id: memberId } = await params;
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

    await supabaseAdmin
      .from("team_members")
      .update({
        avatar: null,
        avatar_blob_key: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);

    return NextResponse.json(
      {
        ok: true,
        deletedBlobKey: blobKey,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting team avatar:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
