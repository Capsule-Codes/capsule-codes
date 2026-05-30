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
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching team member:", err);
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
    if (body.category !== undefined) updateData.category = body.category;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.avatar_blob_key !== undefined)
      updateData.avatar_blob_key = body.avatar_blob_key;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.translations !== undefined)
      updateData.translations = body.translations;

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error(`Team member with id ${id} not found`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error updating team member:", err);
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
      .from("team_members")
      .select("avatar")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Best-effort: delete avatar from storage BEFORE removing the DB row.
    // Failures are logged but never block the row deletion.
    if (existing?.avatar) {
      const path = deriveStoragePath(existing.avatar);
      if (path) {
        try {
          await deleteImageFromStorage(path);
        } catch (storageErr: any) {
          console.error(
            `Failed to delete team member avatar from storage (path=${path}):`,
            storageErr?.message || storageErr
          );
        }
      }
    }

    const { error } = await supabaseAdmin
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting team member:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
