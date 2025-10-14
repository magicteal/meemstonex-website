import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Dummy credentials
  if (email === "admin@example.com" && password === "admin123") {
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