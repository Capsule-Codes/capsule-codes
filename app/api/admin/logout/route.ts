import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/server/admin-auth";

export async function POST() {
  cookies().delete(ADMIN_COOKIE.name);
  return NextResponse.json({ ok: true });
}
