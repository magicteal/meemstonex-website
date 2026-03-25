import { NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = "admin_session";

function getSessionToken() {
  const explicit = process.env.ADMIN_SESSION_TOKEN;
  if (explicit) return explicit;
  const email = process.env.ADMIN_EMAIL || "";
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) return "";
  return `${email}:${password}`;
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ok = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    const res = NextResponse.json({ ok });
    if (ok) {
      const token = getSessionToken();
      if (!token) {
        return NextResponse.json(
          { ok: false, error: "Admin session token is not configured" },
          { status: 500 }
        );
      }
      res.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
    } else {
      res.cookies.delete(ADMIN_SESSION_COOKIE);
    }
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
