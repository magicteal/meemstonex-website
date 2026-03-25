import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

function getSessionToken() {
  const explicit = process.env.ADMIN_SESSION_TOKEN;
  if (explicit) return explicit;
  const email = process.env.ADMIN_EMAIL || "";
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) return "";
  return `${email}:${password}`;
}

function isAuthorized(req) {
  const expected = getSessionToken();
  if (!expected) return false;
  return req.cookies.get(ADMIN_SESSION_COOKIE)?.value === expected;
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const authed = isAuthorized(req);

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/check") return NextResponse.next();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    if (authed) {
      return NextResponse.redirect(new URL("/admin/products", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/") && !authed) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
