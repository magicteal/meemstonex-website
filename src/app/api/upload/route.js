import { NextResponse } from "next/server";
import crypto from "crypto";

// POST { url }
export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "Missing url" }, { status: 400 });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary credentials are available, attempt an authenticated server-side upload (fetch remote URL into Cloudinary)
    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      // signature: sha1 of 'timestamp=TIMESTAMP' + api_secret
      const toSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(toSign).digest("hex");

      const form = new FormData();
      form.append("file", url);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const res = await fetch(uploadUrl, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
      return NextResponse.json({ url: data.secure_url || data.url });
    }

    // Fallback: return the provided URL
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
