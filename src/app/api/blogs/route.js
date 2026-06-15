import { NextResponse } from "next/server";
import { getCollection } from "../../../lib/mongodb";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(col, base) {
  let slug = base || "post";
  let n = 1;
  while (await col.findOne({ slug })) {
    n += 1;
    slug = `${base || "post"}-${n}`;
  }
  return slug;
}

// GET /api/blogs - list all blogs, or fetch a single one via ?slug=
// Supports pagination via page & pageSize
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = (searchParams.get("slug") || "").trim();
    const col = await getCollection("blogs");

    if (slug) {
      const doc = await col.findOne({ slug });
      if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const { _id, ...rest } = doc;
      return NextResponse.json({ id: String(_id), ...rest });
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10));

    const total = await col.countDocuments({});
    const items = await col
      .find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const mapped = items.map(({ _id, ...rest }) => ({ id: String(_id), ...rest }));
    return NextResponse.json({ items: mapped, total, page, pageSize });
  } catch (err) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json({ items: [], total: 0, page: 1, pageSize: 12 });
  }
}

// POST /api/blogs { title, image, body }
export async function POST(req) {
  try {
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
    const slug = await uniqueSlug(col, slugify(t));

    const doc = {
      title: t,
      slug,
      image: img,
      body: b,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await col.insertOne(doc);
    return NextResponse.json({ id: String(res.insertedId), ...doc }, { status: 201 });
  } catch (err) {
    console.error("POST /api/blogs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
