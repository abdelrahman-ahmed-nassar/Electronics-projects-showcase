// Cloudinary upload utility for server-side image uploads
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "./config";

// Initialize Cloudinary with config from environment
function initCloudinary() {
  const config = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });
}

export async function deleteFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    initCloudinary();

    const result = await cloudinary.uploader.destroy(publicId);

    return {
      success: result.result === "ok" || result.result === "not found",
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete from Cloudinary",
    };
  }
}

export async function uploadToCloudinary(
  file: File,
  folder: "projects" | "profiles" | "teams"
): Promise<{ publicId: string; url: string; error?: string }> {
  try {
    initCloudinary();

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error || !result) {
              reject(
                new Error(error?.message || "Failed to upload to Cloudinary")
              );
              return;
            }

            resolve({
              publicId: result.public_id,
              url: result.secure_url,
            });
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      publicId: "",
      url: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload to Cloudinary",
    };
  }
}
