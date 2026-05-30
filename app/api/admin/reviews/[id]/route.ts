import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import {
  deleteImageFromStorage,
  deriveStoragePath,
} from "@/lib/server/media";

// Placeholder avatar URL shipped with the app — NOT a Supabase Storage object.
const PLACEHOLDER_AVATAR = "/placeholder-user.jpg";

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
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching review:", err);
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
    if (body.text !== undefined) updateData.text = body.text;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.translations !== undefined) updateData.translations = body.translations;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.date !== undefined) updateData.date = body.date;

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error(`Review with id ${id} not found`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error updating review:", err);
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
      .from("reviews")
      .select("avatar")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Best-effort: delete avatar from storage BEFORE removing the DB row.
    // Skip the shipped placeholder — it lives in /public, not Supabase Storage.
    if (existing?.avatar && existing.avatar !== PLACEHOLDER_AVATAR) {
      const path = deriveStoragePath(existing.avatar);
      if (path) {
        try {
          await deleteImageFromStorage(path);
        } catch (storageErr: any) {
          console.error(
            `Failed to delete review avatar from storage (path=${path}):`,
            storageErr?.message || storageErr
          );
        }
      }
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting review:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
