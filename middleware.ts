import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/server/admin-auth";
import { LOCALE_HEADER, resolveLocaleRoute } from "@/lib/locale";

const PUBLIC_ADMIN_PATHS = [
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/admin/")) {
    return localeResponse(req);
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

/**
 * English is served from the root without a prefix: rewrite it to the internal
 * `/en` segment. The `/en` prefix itself is never public (308 to the bare path).
 * The request language travels to the root layout in a header so the server
 * renders `<html lang>` and the translations for the URL's locale.
 */
function localeResponse(req: NextRequest) {
  const route = resolveLocaleRoute(req.nextUrl.pathname);
  const url = req.nextUrl.clone();

  if (route.action === "redirect") {
    url.pathname = route.to;
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, route.locale);
  if (route.action === "rewrite") {
    url.pathname = route.to;
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Everything except Next internals and files with an extension; admin and api
  // are filtered by `resolveLocaleRoute`, which is unit tested.
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
