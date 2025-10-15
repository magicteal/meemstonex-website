import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // If trying to access admin pages without a session, redirect to login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Allow the /admin root page to render even without a session (it will show a login button)
    if (pathname === "/admin") {
      return NextResponse.next();
    }
    // For other admin subpaths, enforce auth
    if (!sessionCookie || sessionCookie.value !== "loggedin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // If logged in and trying to access login page, redirect to admin
  if (pathname === "/admin/login") {
    if (sessionCookie && sessionCookie.value === "loggedin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}