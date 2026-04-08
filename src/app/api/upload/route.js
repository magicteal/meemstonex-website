import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

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
    const buffer = Buffer.from(base64Data, "base64");
    
    const extension = mimeType.split('/')[1] || 'jpg';
    const key = `meemstonex-uploads/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    const s3Url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ url: s3Url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
