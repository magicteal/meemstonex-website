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
    // Provide a more actionable message for common TLS/SSL issues on Windows/dev machines
    console.error("Failed to connect to MongoDB:", err.message);
    // print full error in dev to help diagnose (not exposing in production logs)
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
      if (/ssl|tls|TLSV1|SSL routines/i.test(err.message || "")) {
        console.error(
          "MongoDB TLS/SSL handshake failed. If you're running locally behind a proxy/inspector or using an intercepting TLS proxy, you can set MONGODB_TLS_INSECURE=1 in your .env.local to allow invalid certs for development. DO NOT enable this in production."
        );
      }
    }
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
