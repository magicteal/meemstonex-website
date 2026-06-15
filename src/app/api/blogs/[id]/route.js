import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "../../../../lib/mongodb";

export async function GET(_req, { params }) {
  try {
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const col = await getCollection("blogs");
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { _id, ...rest } = doc;
    return NextResponse.json({ id: String(_id), ...rest });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/blogs/:id { title, image, body }
export async function PUT(req, { params }) {
  try {
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { title, image, body } = await req.json();
    const t = String(title || "").trim();
    const img = String(image || "").trim();
    const b = String(body || "").trim();

    if (!t || !img || !b) {
      return NextResponse.json(
        { error: "Invalid payload: title, image, and body are required" },
        { status: 400 }
      );
    }

    const col = await getCollection("blogs");
    const res = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { title: t, image: img, body: b, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    const doc = res && (res.value ?? res);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { _id, ...rest } = doc;
    return NextResponse.json({ id: String(_id), ...rest });
  } catch (err) {
    console.error("PUT /api/blogs/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/blogs/:id
export async function DELETE(_req, { params }) {
  try {
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const col = await getCollection("blogs");
    const res = await col.findOneAndDelete({ _id: new ObjectId(id) });
    const doc = res && (res.value ?? res);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { _id, ...rest } = doc;
    return NextResponse.json({ id: String(_id), ...rest });
  } catch (err) {
    console.error("DELETE /api/blogs/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
