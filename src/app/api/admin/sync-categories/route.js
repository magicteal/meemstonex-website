import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/mongodb";
import { rawCategories } from "../../../../lib/categories";

// POST /api/admin/sync-categories
// Server-side utility to upsert the canonical category list into the DB.
// Intended to be called from the Admin UI. For production, consider adding auth.
export async function POST() {
  try {
    const names = rawCategories.map((n) => String(n).trim()).filter(Boolean);
    const col = await getCollection("categories");
    let upserted = 0;
    for (const name of names) {
      const res = await col.updateOne(
        { name },
        { $setOnInsert: { name, createdAt: new Date() } },
        { upsert: true }
      );
      if (res.upsertedCount === 1 || res.upsertedId) upserted += 1;
    }
    return NextResponse.json({ ok: true, total: names.length, upserted });
  } catch (err) {
    console.error("POST /api/admin/sync-categories error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
