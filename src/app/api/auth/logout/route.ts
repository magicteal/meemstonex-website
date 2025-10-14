import { NextResponse } from "next/server";

export async function POST() {
  // 1. Create a response object
  const response = NextResponse.json({ message: "Logout successful" });

  // 2. Clear the session cookie by setting its expiry to a past date
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Set expiry date to the past
    path: "/",
  });

  return response;
}