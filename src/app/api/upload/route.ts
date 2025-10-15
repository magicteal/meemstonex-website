import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiOptions } from "cloudinary";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Optional: folder and public_id
    const folder = (data.get("folder") as string) || "uploads";
    const publicIdBase = `${Date.now()}-${(file.name || "file").replace(/\s/g, "_")}`;

    // Upload to Cloudinary using upload_stream to avoid temp files
    const uploadOptions: UploadApiOptions = {
      folder,
      public_id: publicIdBase,
      resource_type: "image",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      format?: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, res) => {
        if (error || !res) return reject(error || new Error("Cloudinary upload failed"));
        resolve({
          secure_url: res.secure_url,
          public_id: res.public_id,
          width: res.width,
          height: res.height,
          format: res.format,
        });
      });
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "File upload failed." },
      { status: 500 }
    );
  }
}