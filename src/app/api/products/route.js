import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "../../../lib/mongodb";

// GET /api/products
// Supports query params: page, pageSize, q, categories (csv), minPrice, maxPrice, sort (name:asc|price:desc)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
    const q = (searchParams.get("q") || "").trim();
    const categoriesCsv = (searchParams.get("categories") || "").trim();
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");
    const sortParam = searchParams.get("sort") || "name:asc";

    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      filter.price = {};
      if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice;
      if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice;
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }
    if (categoriesCsv) {
      const cats = categoriesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (cats.length) filter.categories = { $all: cats };
    }

    const [sortKey, sortDir] = sortParam.split(":");
    const sort = { [sortKey]: sortDir === "desc" ? -1 : 1 };

    const col = await getCollection("products");
    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Convert _id to id
    const mapped = items.map(({ _id, ...rest }) => ({
      id: String(_id),
      ...rest,
    }));
    return NextResponse.json({ items: mapped, total, page, pageSize });
  } catch (err) {
    console.error("GET /api/products error:", err);
    // Graceful fallback to avoid crashing pages if DB is unavailable
    return NextResponse.json({ items: [], total: 0, page: 1, pageSize: 12 });
  }
}

// POST /api/products
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      categories = [],
      price,
      photo,
      description = "",
      currency,
    } = body;
    if (!name || typeof price !== "number" || price < 0 || !photo) {
      return NextResponse.json(
        { error: "Invalid payload: name, price (>=0), photo are required" },
        { status: 400 }
      );
    }

    const doc = {
      name: String(name),
      categories: Array.isArray(categories) ? categories : [],
      price: Number(price),
      photo: String(photo),
      description: String(description || ""),
      currency: typeof currency === "string" && currency ? currency : "INR",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const col = await getCollection("products");
    const res = await col.insertOne(doc);
    // Ensure categories exist in categories collection
    if (Array.isArray(doc.categories) && doc.categories.length) {
      const catCol = await getCollection("categories");
      for (const name of doc.categories) {
        if (!name) continue;
        await catCol.updateOne(
          { name },
          { $setOnInsert: { name, createdAt: new Date() } },
          { upsert: true }
        );
      }
    }
    return NextResponse.json(
      { id: String(res.insertedId), ...doc },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/products?id=...
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const patch = await req.json();
    const allowed = [
      "name",
      "categories",
      "price",
      "photo",
      "description",
      "currency",
    ];
    const update = {};
    for (const k of allowed) if (k in patch) update[k] = patch[k];
    if (!Object.keys(update).length)
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    update.updatedAt = new Date();

    const col = await getCollection("products");
    const res = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
    const doc = res && (res.value ?? res);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // If categories were updated, upsert them into categories collection
    if (Array.isArray(update.categories) && update.categories.length) {
      const catCol = await getCollection("categories");
      for (const name of update.categories) {
        if (!name) continue;
        await catCol.updateOne(
          { name },
          { $setOnInsert: { name, createdAt: new Date() } },
          { upsert: true }
        );
      }
    }
    const { _id, ...rest } = doc;
    return NextResponse.json({ id: String(_id), ...rest });
  } catch (err) {
    console.error("PUT /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products?id=...
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const col = await getCollection("products");
    const res = await col.findOneAndDelete({ _id: new ObjectId(id) });
    const doc = res && (res.value ?? res);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { _id, ...rest } = doc;
    return NextResponse.json({ id: String(_id), ...rest });
  } catch (err) {
    console.error("DELETE /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
