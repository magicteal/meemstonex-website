import { NextResponse } from "next/server";
import { getCollection } from "../../../lib/mongodb";

const samplePhotos = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526178611754-5403e6f7e859?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514328355161-9f2e1e233b76?q=80&w=1200&auto=format&fit=crop",
];

function buildSeed() {
  const names = [
    "Aurora Headphones",
    "Nimbus Hoodie",
    "Cascade Backpack",
    "Lumen Desk Lamp",
    "Pulse Smartwatch",
    "Summit Water Bottle",
  ];
  const prices = [129.99, 59.0, 79.99, 39.99, 199.0, 24.5];
  const categories = [
    ["Electronics", "Accessories"],
    ["Apparel"],
    ["Outdoor", "Sports"],
    ["Home", "Office"],
    ["Electronics"],
    ["Sports", "Outdoor"],
  ];
  return names.map((name, i) => ({
    name,
    categories: categories[i],
    price: prices[i],
    photo: samplePhotos[i % samplePhotos.length],
    description:
      "High-quality product designed for everyday use. Durable materials, modern aesthetic, and great performance.",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function POST() {
  try {
    const col = await getCollection("products");
    const count = await col.countDocuments();
    if (count > 0)
      return NextResponse.json({
        ok: true,
        inserted: 0,
        note: "Products already present",
      });
    const docs = buildSeed();
    const res = await col.insertMany(docs);
    return NextResponse.json({
      ok: true,
      inserted: res.insertedCount || docs.length,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
