import { NextResponse } from "next/server";
import { processAndUploadCover } from "@/lib/server/media";
import { validateCoverFile } from "@/lib/project-cover";
import { revalidating } from "@/lib/server/revalidate";

// Auth: /api/admin/* is guarded by middleware.ts (admin_session cookie).
// Uploads the file only; the client then PATCHes `projects.image`. The
// previous cover object is never deleted.
async function handlePOST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const form = await req.formData();
    const file = form.get("cover");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No cover provided" }, { status: 400 });
    }

    const check = validateCoverFile(file);
    if (!check.ok) {
      return NextResponse.json({ message: check.message }, { status: 400 });
    }

    const cover = await processAndUploadCover(projectId, file);
    return NextResponse.json({ ok: true, url: cover.url }, { status: 201 });
  } catch (err: any) {
    console.error("Error uploading cover:", err);
    return NextResponse.json(
      { message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export const POST = revalidating(["projects"], handlePOST);
