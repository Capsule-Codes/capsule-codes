import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import type { ContactInfo } from "@/lib/types/contact";

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    // Get the first (and only) row from contact_info table
    const { data, error } = await supabaseAdmin
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // If record doesn't exist, return null
      if (error.code === "PGRST116") {
        return NextResponse.json(null, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching contact info:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Service role key not configured" },
        { status: 500 }
      );
    }

    const body: Partial<ContactInfo> = await request.json();

    // First, get the existing record to get its ID
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from("contact_info")
      .select("id")
      .limit(1)
      .maybeSingle();

    const updateData: any = {};

    // Only include fields that are provided (not undefined)
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.translations !== undefined) updateData.translations = body.translations;

    console.log("PUT /api/admin/contact-info - Body received:", body);
    console.log("PUT /api/admin/contact-info - Update data:", updateData);
    console.log("PUT /api/admin/contact-info - Existing data:", existingData);
    console.log("PUT /api/admin/contact-info - Fetch error:", fetchError);

    let result;
    if (existingData) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from("contact_info")
        .update(updateData)
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) {
        console.error("PUT /api/admin/contact-info - Update error:", error);
        throw error;
      }
      console.log("PUT /api/admin/contact-info - Updated data:", data);
      result = data;
    } else {
      // Create new record (use a default ID if needed)
      updateData.id = "00000000-0000-0000-0000-000000000000";
      const { data, error } = await supabaseAdmin
        .from("contact_info")
        .insert(updateData)
        .select()
        .single();

      if (error) {
        console.error("PUT /api/admin/contact-info - Insert error:", error);
        throw error;
      }
      console.log("PUT /api/admin/contact-info - Inserted data:", data);
      result = data;
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Error updating contact info:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
