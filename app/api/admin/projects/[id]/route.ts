import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import {
  deleteImageFromStorage,
  deriveStoragePath,
} from "@/lib/server/media";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching project:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only include fields that are provided (not undefined)
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.translations !== undefined) updateData.translations = body.translations;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.technologies !== undefined) updateData.technologies = body.technologies;
    if (body.liveUrl !== undefined) updateData.live_url = body.liveUrl;
    if (body.live_url !== undefined) updateData.live_url = body.live_url;
    if (body.githubUrl !== undefined) updateData.github_url = body.githubUrl;
    if (body.github_url !== undefined) updateData.github_url = body.github_url;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.published !== undefined) updateData.published = body.published;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error updating project:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    // Fetch the row first so we can cascade-delete any associated storage objects.
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("image, images")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Collect every storage path we can derive from `image` + `images[]`.
    const pathsToDelete: string[] = [];

    if (existing?.image) {
      const path = deriveStoragePath(existing.image);
      if (path) pathsToDelete.push(path);
    }

    if (Array.isArray(existing?.images)) {
      for (const item of existing.images) {
        const raw =
          typeof item === "string"
            ? item
            : item && typeof item === "object"
              ? (item as any).blobKey ?? (item as any).url
              : null;
        if (!raw || typeof raw !== "string") continue;
        const path = deriveStoragePath(raw);
        if (path) pathsToDelete.push(path);
      }
    }

    // Dedupe in case `image` matches one of the entries in `images[]`.
    const uniquePaths = Array.from(new Set(pathsToDelete));

    // Best-effort: delete all storage objects in parallel. Log failures, don't abort.
    if (uniquePaths.length > 0) {
      const results = await Promise.allSettled(
        uniquePaths.map((path) => deleteImageFromStorage(path))
      );
      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          console.error(
            `Failed to delete project image from storage (path=${uniquePaths[idx]}):`,
            result.reason?.message || result.reason
          );
        }
      });
    }

    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting project:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
