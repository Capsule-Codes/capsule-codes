import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/server/admin-auth";

const PUBLIC_ADMIN_PATHS = [
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  if (
    PUBLIC_ADMIN_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    )
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_session")?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
