import { NextResponse } from "next/server";
import { uploadProject } from "@/utils/supabase/data-services";
import { createClient } from "@/utils/supabase/server"; // Import the standard server client
import { ProjectInterface } from "@/app/Types";

export async function POST(request: Request) {
  // Use the standard server client to read the user session from cookies
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }


  try {
    const rawData = await request.json();

    // Convert the comma-separated tags string into a string array
    // Trim whitespace from each tag and filter out empty strings
    const tagsArray = rawData.tags
      ? rawData.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== "")
      : null;

    const projectData: Omit<ProjectInterface, "id" | "created_at"> = {
      title: rawData.title || null,
      description: rawData.description || null,
      image: rawData.image || null,
      tags: tagsArray, // Use the processed array
      period: rawData.period || null,
      link: rawData.link || null,
      teamId: rawData.teamId ? parseInt(rawData.teamId, 10) : null,
      // Optional: Add user_id if linking projects to users
      // user_id: user.id, // You can now reliably add the user ID
    };


    if (!projectData.title || !projectData.description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    // uploadProject internally uses createServiceClient (service role) for the insert
    const newProject = await uploadProject(projectData);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("API Route: Error during project upload:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload project due to an unknown server error";
    // Check if the error is a Supabase AuthError or PostgrestError for more details
    // if (error && typeof error === 'object' && 'code' in error) { ... }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
