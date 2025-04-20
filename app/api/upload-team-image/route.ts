import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server-service";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    // Get the form data with the file
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { message: "No image file provided" },
        { status: 400 }
      );
    }

    // Generate a unique filename to avoid collisions
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Upload to Supabase Storage in the teams-images bucket
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from("teams-images")
      .upload(fileName, imageFile);

    if (error || !data) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { message: `Error uploading image: ${error.message}` },
        { status: 500 }
      );
    }

    // Construct the public URL for the uploaded image
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/teams-images/${fileName}`;

    return NextResponse.json({ imageUrl });
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
