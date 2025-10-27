import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  // We avoid throwing at module import time in Next.js; errors will surface when getDb() is called
  console.warn("MONGODB_URI is not set. Set it in your .env.local file.");
}

let client;
let clientPromise;
let indexesPromise;

if (!global._mongoClientPromise) {
  const options = {};
  if (process.env.MONGODB_TLS_INSECURE === "1") {
    // Dev-only: allow invalid certs/hostnames to get around local SSL interception issues
    options.tlsAllowInvalidCertificates = true;
    options.tlsAllowInvalidHostnames = true;
  }
  client = new MongoClient(uri || "", options);
  global._mongoClientPromise = client.connect().catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    throw err;
  });
}

clientPromise = global._mongoClientPromise;

async function ensureIndexes(db) {
  if (global._mongoIndexesInitialized) return;
  try {
    await Promise.all([
      db.collection("products").createIndexes([
        { key: { name: 1 }, name: "name_asc" },
        { key: { price: 1 }, name: "price_asc" },
        { key: { categories: 1 }, name: "categories_asc" },
        { key: { createdAt: -1 }, name: "createdAt_desc" },
      ]),
      db
        .collection("categories")
        .createIndex({ name: 1 }, { unique: true, name: "name_unique" })
        .catch(() => {}),
    ]);
  } catch (e) {
    console.warn("Index creation warning:", e?.message || e);
  }
  global._mongoIndexesInitialized = true;
}

export async function getDb() {
  if (!uri) throw new Error("Missing MONGODB_URI environment variable");
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "meemstonex";
  const db = client.db(dbName);
  // kick off index creation once, non-blocking
  if (!indexesPromise) {
    indexesPromise = ensureIndexes(db);
  }
  return db;
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
