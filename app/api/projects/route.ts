import { NextResponse } from "next/server";
import {
  uploadProject,
  getProjectsForDisplay,
} from "@/utils/supabase/data-services";
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

    // Process tags based on whether they're already an array or a string that needs to be split
    const tagsArray = rawData.tags
      ? Array.isArray(rawData.tags)
        ? rawData.tags.filter((tag: string) => tag.trim() !== "")
        : rawData.tags
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
      isFeatured: rawData.isFeatured || false, // Add the missing isFeatured property
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Fetch projects with optional date range filtering
    const projects = await getProjectsForDisplay(startDate, endDate);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("API Route GET /api/projects error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
