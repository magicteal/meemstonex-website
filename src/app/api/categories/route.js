import { NextResponse } from "next/server";
import { getCollection } from "../../../lib/mongodb";

// GET /api/categories - return explicit categories only (admin-managed)
export async function GET() {
  try {
    const catCol = await getCollection("categories");
    const explicit = await catCol
      .find({}, { projection: { _id: 0, name: 1 } })
      .toArray();
    const sorted = (explicit || [])
      .map((c) => c?.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    return NextResponse.json(sorted);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    // Graceful fallback: empty list so UI can still work (admin can add categories)
    return NextResponse.json([]);
  }
}

// POST /api/categories { name }
export async function POST(req) {
  try {
    const { name } = await req.json();
    const n = (name || "").trim();
    if (!n)
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    const col = await getCollection("categories");
    const existing = await col.findOne({ name: n });
    if (existing) return NextResponse.json(n);
    await col.insertOne({ name: n, createdAt: new Date() });
    return NextResponse.json(n, { status: 201 });
  } catch (err) {
    console.error("POST /api/categories error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/categories { oldName, newName }
export async function PUT(req) {
  try {
    const { oldName, newName } = await req.json();
    const from = (oldName || "").trim();
    const to = (newName || "").trim();
    if (!from || !to)
      return NextResponse.json(
        { error: "oldName and newName are required" },
        { status: 400 }
      );
    if (from === to)
      return NextResponse.json({ ok: true, renamed: 0, updatedProducts: 0 });

    // Update categories collection
    const catCol = await getCollection("categories");
    const exists = await catCol.findOne({ name: to });
    if (!exists) await catCol.insertOne({ name: to, createdAt: new Date() });
    await catCol.deleteOne({ name: from });

    // Update products referencing the old name
    const prodCol = await getCollection("products");
    const res = await prodCol.updateMany(
      { categories: from },
      { $addToSet: { categories: to }, $pull: { categories: from } }
    );
    return NextResponse.json({
      ok: true,
      renamed: 1,
      updatedProducts: res.modifiedCount || 0,
    });
  } catch (err) {
    console.error("PUT /api/categories error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/categories?name=... or /api/categories?all=true to reset all categories
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const all = (searchParams.get("all") || "").toLowerCase();
    if (all === "true" || all === "1") {
      const catCol = await getCollection("categories");
      const catRes = await catCol.deleteMany({});
      const prodCol = await getCollection("products");
      const prodRes = await prodCol.updateMany(
        {},
        { $set: { categories: [] } }
      );
      return NextResponse.json({
        ok: true,
        deletedCategories: catRes.deletedCount ?? 0,
        productsUpdated: prodRes.modifiedCount ?? 0,
      });
    }

    const name = (searchParams.get("name") || "").trim();
    if (!name)
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    const catCol = await getCollection("categories");
    await catCol.deleteOne({ name });
    const prodCol = await getCollection("products");
    const res = await prodCol.updateMany(
      { categories: name },
      { $pull: { categories: name } }
    );
    return NextResponse.json({
      ok: true,
      deleted: 1,
      updatedProducts: res.modifiedCount || 0,
    });
  } catch (err) {
    console.error("DELETE /api/categories error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
