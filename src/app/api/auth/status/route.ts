import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const isLoggedIn = !!session && session.value === "loggedin";
  return NextResponse.json({ authenticated: isLoggedIn });
}
