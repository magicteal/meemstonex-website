const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const env = {};
  const paths = [
    path.join(__dirname, "../.env"),
    path.join(__dirname, "../.env.local")
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
            env[k] = v;
          }
        }
      }
    }
  }
  return env;
}

const env = loadEnv();
const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB || "meemstonex";

if (!uri) {
  console.error("Error: Missing MONGODB_URI in env.");
  process.exit(1);
}

// Load mapping file
const mapPath = path.join(__dirname, "s3-media-map.json");
if (!fs.existsSync(mapPath)) {
  console.error(`Error: Mapping file not found at ${mapPath}. Run scripts/upload-to-s3.js first.`);
  process.exit(1);
}

const mediaMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

// Given a local path like "/products/P1.jpg" or a sub-path, find a matching S3 URL in our map.
// To handle extension changes (like .jpg -> .webp), we strip the extension when checking the map.
function getS3Url(localPath) {
  if (!localPath || typeof localPath !== "string") return null;
  
  // Try exact match first
  if (mediaMap[localPath]) return mediaMap[localPath];
  
  // Try match without extension
  const cleanPath = localPath.trim();
  const ext = path.extname(cleanPath).toLowerCase();
  if (ext) {
    const baseWithoutExt = cleanPath.slice(0, -ext.length);
    // Find key in map that starts with baseWithoutExt
    const matchedKey = Object.keys(mediaMap).find((k) => {
      const kExt = path.extname(k).toLowerCase();
      const kBase = k.slice(0, -kExt.length);
      return kBase === baseWithoutExt;
    });
    if (matchedKey) return mediaMap[matchedKey];
  }
  
  return null;
}

async function migrateProducts(db) {
  const col = db.collection("products");
  const products = await col.find({}).toArray();
  console.log(`Migrating ${products.length} products...`);
  
  let updatedCount = 0;
  for (const product of products) {
    let changed = false;
    let newPhotos = [];
    
    if (Array.isArray(product.photos)) {
      newPhotos = product.photos.map((p) => {
        const s3 = getS3Url(p);
        if (s3) {
          changed = true;
          return s3;
        }
        return p;
      });
    }
    
    let newPhoto = product.photo;
    const s3Photo = getS3Url(product.photo);
    if (s3Photo) {
      changed = true;
      newPhoto = s3Photo;
    }
    
    if (changed) {
      await col.updateOne(
        { _id: product._id },
        { $set: { photos: newPhotos, photo: newPhoto } }
      );
      updatedCount += 1;
    }
  }
  console.log(`Successfully updated ${updatedCount} products to S3 URLs.`);
}

async function migrateHomepageSettings(db) {
  const col = db.collection("settings");
  const doc = await col.findOne({ _id: "homepage" });
  if (!doc) {
    console.log("No homepage settings document found in DB. Skipping.");
    return;
  }
  
  console.log("Migrating homepage settings document...");
  
  const updates = {};
  
  // 1. Hero videos
  if (doc.hero && Array.isArray(doc.hero.videos)) {
    const newVideos = doc.hero.videos.map((v) => getS3Url(v) || v);
    if (JSON.stringify(newVideos) !== JSON.stringify(doc.hero.videos)) {
      updates["hero.videos"] = newVideos;
    }
  }
  
  // 2. About imageUrl
  if (doc.about && doc.about.imageUrl) {
    const s3 = getS3Url(doc.about.imageUrl);
    if (s3) updates["about.imageUrl"] = s3;
  }
  
  // 3. About trailImages
  if (doc.about && Array.isArray(doc.about.trailImages)) {
    const newTrail = doc.about.trailImages.map((img) => getS3Url(img) || img);
    if (JSON.stringify(newTrail) !== JSON.stringify(doc.about.trailImages)) {
      updates["about.trailImages"] = newTrail;
    }
  }
  
  // 4. Stats imageUrl
  if (doc.stats && doc.stats.imageUrl) {
    const s3 = getS3Url(doc.stats.imageUrl);
    if (s3) updates["stats.imageUrl"] = s3;
  }
  
  // 5. Contact imageUrl
  if (doc.contact && doc.contact.imageUrl) {
    const s3 = getS3Url(doc.contact.imageUrl);
    if (s3) updates["contact.imageUrl"] = s3;
  }
  
  if (Object.keys(updates).length > 0) {
    await col.updateOne({ _id: "homepage" }, { $set: updates });
    console.log("Successfully updated homepage settings document to S3 URLs.");
  } else {
    console.log("Homepage settings document is already up to date.");
  }
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    await migrateProducts(db);
    await migrateHomepageSettings(db);
    
    console.log("\nDatabase S3 migration successfully completed!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
