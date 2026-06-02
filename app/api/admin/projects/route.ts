import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { mapProjectRow } from "@/lib/server/data";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json((data || []).map(mapProjectRow), { status: 200 });
  } catch (err: any) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([
        {
          title: body.title,
          description: body.description,
          translations: body.translations,
          image: body.image,
          images: body.images || [],
          technologies: body.technologies,
          live_url: body.liveUrl || body.live_url,
          app_store_url: body.appStoreUrl ?? body.app_store_url,
          play_store_url: body.playStoreUrl ?? body.play_store_url,
          gradient_preset: body.gradientPreset ?? body.gradient_preset,
          gradient_from: body.gradientFrom ?? body.gradient_from,
          gradient_to: body.gradientTo ?? body.gradient_to,
          cover_media_id: body.coverMediaId ?? body.cover_media_id,
          category: body.category,
          featured: body.featured || false,
          published: body.published || false,
          show_on_home: (body.showOnHome ?? body.show_on_home) ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(mapProjectRow(data), { status: 201 });
  } catch (err: any) {
    console.error("Error creating project:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
