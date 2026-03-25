import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "meemstonex-website",
      timestamp: new Date().toISOString(),
      runtime: "nodejs",
    },
    { status: 200 }
  );
}
