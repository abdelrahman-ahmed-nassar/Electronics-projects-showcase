import { NextResponse } from "next/server";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/utils/cloudinary/upload";
import {
  extractPublicIdFromUrl,
  isDefaultCloudinaryImage,
} from "@/utils/cloudinary/helpers";

export async function POST(request: Request) {
  try {
    // Get the form data with the file
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const oldImageUrl = formData.get("oldImageUrl") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { message: "No image file provided" },
        { status: 400 }
      );
    }

    // Delete old image from Cloudinary if it exists and is not a default image
    if (oldImageUrl && !isDefaultCloudinaryImage(oldImageUrl)) {
      const publicId = extractPublicIdFromUrl(oldImageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(imageFile, "teams");

    if (result.error) {
      console.error("Cloudinary upload error:", result.error);
      return NextResponse.json(
        { message: `Error uploading image: ${result.error}` },
        { status: 500 }
      );
    }

    // Return the full Cloudinary URL (will be stored in database)
    return NextResponse.json({
      imageUrl: result.url,
      publicId: result.publicId,
      publicUrl: result.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
