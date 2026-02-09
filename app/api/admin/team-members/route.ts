import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("Error fetching team members:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .insert([
        {
          translations: body.translations,
          avatar: body.avatar,
          category: body.category,
          order: body.order,
          published: body.published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Error creating team member:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
