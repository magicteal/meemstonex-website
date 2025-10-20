import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "../../../../lib/mongodb";

export async function GET(_req, { params }) {
  try {
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const col = await getCollection("products");
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { _id, ...rest } = doc;
    return NextResponse.json({ id: String(_id), ...rest });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
