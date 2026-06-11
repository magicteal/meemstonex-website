const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Parse .env manually
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
const bucket = env.AWS_S3_BUCKET;
const region = env.AWS_REGION || "ap-south-1";
const accessKeyId = env.AWS_ACCESS_KEY_ID;
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey || !bucket) {
  console.error("Error: Missing AWS environment variables in .env.");
  console.error(`AWS_ACCESS_KEY_ID set: ${!!accessKeyId}`);
  console.error(`AWS_SECRET_ACCESS_KEY set: ${!!secretAccessKey}`);
  console.error(`AWS_S3_BUCKET set: ${!!bucket}`);
  process.exit(1);
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const mediaMap = {};

// Scan and upload directories
const directories = [
  { relDir: "img", isImage: true },
  { relDir: "products", isImage: true },
  { relDir: "videos", isImage: false }
];

async function uploadFile(filePath, relPath, isImage) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  
  let finalBuffer = fileBuffer;
  let finalExt = ext.slice(1);
  let mimeType = "application/octet-stream";
  
  if (isImage) {
    // Process image to optimized webp format
    console.log(`Optimizing image: ${relPath}`);
    try {
      finalBuffer = await sharp(fileBuffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 75, effort: 6 })
        .toBuffer();
      finalExt = "webp";
      mimeType = "image/webp";
    } catch (err) {
      console.warn(`Failed to optimize ${relPath} using Sharp. Uploading original.`, err.message);
      if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
      else if (ext === ".png") mimeType = "image/png";
    }
  } else {
    if (ext === ".mp4") mimeType = "video/mp4";
  }

  const s3Key = `meemstonex-static/${relPath.split("/")[0]}/${baseName}.${finalExt}`;
  console.log(`Uploading ${filePath} -> S3: ${s3Key}`);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: finalBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
  const originalWebPath = `/${relPath}`;
  mediaMap[originalWebPath] = s3Url;
}

async function main() {
  const publicDir = path.join(__dirname, "../public");
  
  for (const { relDir, isImage } of directories) {
    const dirPath = path.join(publicDir, relDir);
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist: ${dirPath}`);
      continue;
    }
    
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      // Skip directories (fonts or subfolders)
      if (stat.isDirectory()) continue;
      
      const relPath = `${relDir}/${file}`;
      try {
        await uploadFile(filePath, relPath, isImage);
      } catch (err) {
        console.error(`Failed to upload ${relPath}:`, err.message);
      }
    }
  }
  
  // Write map file
  const mapPath = path.join(__dirname, "s3-media-map.json");
  fs.writeFileSync(mapPath, JSON.stringify(mediaMap, null, 2));
  console.log(`\nUpload complete! Created mapping file at: ${mapPath}`);
  console.log(`Uploaded ${Object.keys(mediaMap).length} assets.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
