import { getImageFromAzure } from "@/lib/server/media";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;

    if (!path || path.length === 0) {
      return NextResponse.json(
        { message: "Image path is required" },
        { status: 400 }
      );
    }

    // Reconstruct the blob key from the path segments
    const blobKey = path.join("/");

    // Fetch and serve the image from Azure
    return await getImageFromAzure(blobKey, req);
  } catch (err: any) {
    console.error("Error serving image:", err);
    return NextResponse.json(
      { message: err?.message || "Image not found" },
      { status: 404 }
    );
  }
}
