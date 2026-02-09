import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 },
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
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.translations !== undefined)
      updateData.translations = body.translations;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

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
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 },
      );
    }

    const { id } = await params;

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
      { status: 500 },
    );
  }
}
