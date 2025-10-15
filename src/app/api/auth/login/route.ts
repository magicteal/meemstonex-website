import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Credentials from environment (set these in .env.local or production env)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  // Basic check (constant-time comparison for password)
  let passwordsMatch = false;
  try {
    if (password && ADMIN_PASSWORD) {
      const a = Buffer.from(String(password));
      const b = Buffer.from(String(ADMIN_PASSWORD));
      // timingSafeEqual throws if buffers have different lengths
      if (a.length === b.length) {
        passwordsMatch = crypto.timingSafeEqual(a, b);
      }
    }
  } catch {
    passwordsMatch = false;
  }

  if (email === ADMIN_EMAIL && passwordsMatch) {
    // 1. Create a response object first
    const response = NextResponse.json({ message: "Login successful" });

    // 2. Set the cookie on the response object
    response.cookies.set("session", "loggedin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  }

  return new NextResponse("Invalid credentials", { status: 401 });
}