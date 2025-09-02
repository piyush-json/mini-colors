import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { type, metadata } = await request.json();

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const imageKey = `leaderboard/${type || "leaderboard"}-${timestamp}-${randomId}.png`;
    const metadataKey = `metadata/${type || "leaderboard"}-${timestamp}-${randomId}.json`;

    // Generate presigned URL for image upload
    const imageUploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: imageKey,
      ContentType: "image/png",
      ContentDisposition: "inline",
    });

    const imageUploadUrl = await getSignedUrl(s3Client, imageUploadCommand, {
      expiresIn: 3600, // 1 hour
    });

    // Generate image URL (public access)
    const imageUrl = `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${imageKey}`;

    let metadataUploadUrl = null;
    let metadataUrl = null;

    // If metadata is provided, generate presigned URL for metadata upload
    if (metadata) {
      const metadataUploadCommand = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: metadataKey,
        ContentType: "application/json",
        ContentDisposition: "inline",
      });

      metadataUploadUrl = await getSignedUrl(s3Client, metadataUploadCommand, {
        expiresIn: 3600, // 1 hour
      });

      metadataUrl = `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${metadataKey}`;
    }

    return NextResponse.json({
      success: true,
      imageUploadUrl,
      imageUrl,
      metadataUploadUrl,
      metadataUrl,
      imageKey,
      metadataKey,
    });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs" },
      { status: 500 },
    );
  }
}
