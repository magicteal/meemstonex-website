import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// POST { url }
export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "Missing url" }, { status: 400 });

    if (!url.startsWith("data:")) {
      return NextResponse.json({ url });
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    const bucket = process.env.AWS_S3_BUCKET;

    // Parse data URL
    const matches = url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid data URL" }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const originalBuffer = Buffer.from(base64Data, "base64");
    
    // Compress image heavily using Sharp before uploading to S3
    const optimizedBuffer = await sharp(originalBuffer)
      .resize({ width: 1920, withoutEnlargement: true }) // Max 1080p equivalent width
      .webp({ quality: 75, effort: 6 }) // Convert to efficient WebP
      .toBuffer();
    
    const extension = "webp";
    const finalMimeType = "image/webp";
    const key = `meemstonex-uploads/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: optimizedBuffer,
      ContentType: finalMimeType,
    });

    await s3Client.send(command);

    const s3Url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ url: s3Url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
