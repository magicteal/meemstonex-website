import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/mongodb";
import { rawCategories } from "../../../../lib/categories";

// POST /api/categories/seed
// Seeds the categories collection with the canonical list from src/lib/categories.js
// Auth: requires a token that matches ADMIN_PASSWORD, provided as:
//   - Authorization: Bearer <token>
//   - or query parameter ?token=<token>
export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const bearer = authHeader.replace(/^Bearer\s+/i, "");
    const url = new URL(req.url);
    const qpToken = url.searchParams.get("token") || "";
    const token = bearer || qpToken;

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Server is missing ADMIN_PASSWORD env" },
        { status: 500 }
      );
    }
    if (token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const input = Array.isArray(body?.categories)
      ? body.categories
      : rawCategories;
    const names = (input || [])
      .map((n) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean);
    if (!names.length) {
      return NextResponse.json(
        { error: "No categories provided" },
        { status: 400 }
      );
    }

    const col = await getCollection("categories");
    let upserted = 0;
    for (const name of names) {
      const res = await col.updateOne(
        { name },
        { $setOnInsert: { name, createdAt: new Date() } },
        { upsert: true }
      );
      // In modern drivers upsertedCount exists, otherwise check upsertedId
      if (res.upsertedCount === 1 || res.upsertedId) upserted += 1;
    }

    return NextResponse.json({ ok: true, total: names.length, upserted });
  } catch (err) {
    console.error("POST /api/categories/seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
