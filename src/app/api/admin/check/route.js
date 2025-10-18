import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ok = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    return NextResponse.json({ ok });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
