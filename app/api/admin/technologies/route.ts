import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { revalidating } from "@/lib/server/revalidate";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("technologies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("Error fetching technologies:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

async function handlePOST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("technologies")
      .insert([
        {
          name: body.name,
          category: body.category,
          icon: body.icon,
          translations: body.translations,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Error creating technology:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export const POST = revalidating(["technologies"], handlePOST);
