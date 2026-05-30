import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/server/admin-auth";

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: { email: session.email } });
}
