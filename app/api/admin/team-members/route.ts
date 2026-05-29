import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

const VALID_CATEGORIES = ["cofounder", "developer"] as const;
const REQUIRED_LOCALES = ["en", "es", "it"] as const;

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    // Admin sees drafts too — NO published filter.
    // Ordering: category → "order" → created_at.
    // `order` is a reserved word, so it must be quoted in the column ref.
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .order("category", { ascending: true })
      .order('"order"', { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("Error fetching team members:", err);
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

    // Validate category
    if (
      !body.category ||
      !VALID_CATEGORIES.includes(body.category)
    ) {
      return NextResponse.json(
        {
          message: `Invalid or missing "category". Must be one of: ${VALID_CATEGORIES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate translations shape (top-level locale keys only)
    if (
      !body.translations ||
      typeof body.translations !== "object" ||
      Array.isArray(body.translations)
    ) {
      return NextResponse.json(
        { message: '"translations" must be an object with en/es/it keys' },
        { status: 400 }
      );
    }
    for (const locale of REQUIRED_LOCALES) {
      if (!body.translations[locale]) {
        return NextResponse.json(
          { message: `"translations.${locale}" is required` },
          { status: 400 }
        );
      }
    }

    const insertRow: Record<string, unknown> = {
      category: body.category,
      translations: body.translations,
      published: body.published === undefined ? true : !!body.published,
    };

    if (body.order !== undefined) insertRow.order = body.order;
    if (body.avatar !== undefined) insertRow.avatar = body.avatar;
    if (body.avatar_blob_key !== undefined)
      insertRow.avatar_blob_key = body.avatar_blob_key;

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .insert([insertRow])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Error creating team member:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
