import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ProjectInterface } from "@/app/Types";

// This handler will handle PUT and DELETE requests for a specific project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the project ID from the URL params
  const projectId = (await params).id;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  // Use the standard server client to read the user session from cookies
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body
    const projectData = await request.json();

    // Prepare the update data
    const updateData: Partial<ProjectInterface> = {
      title: projectData.title || null,
      description: projectData.description || null,
      image: projectData.image || null,
      tags: projectData.tags || [],
      period: projectData.period || null,
      link: projectData.link || null,
      isFeatured: projectData.isFeatured || false,
    };

    // Check if the project exists and belongs to the user or their team
    const { data: existingProject, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this project
    // They must be either the creator or on the same team
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("team")
      .eq("id", user.id)
      .single();

    const isAuthorized =
      (existingProject.teamId === null && existingProject.userId === user.id) ||
      (existingProject.teamId !== null &&
        existingProject.teamId === userProfile?.team);

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "You are not authorized to update this project" },
        { status: 403 }
      );
    }

    // Update the project
    const { data: updatedProject, error: updateError } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", projectId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating project: ${updateError.message}`);
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Failed to update project", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the project ID from the URL params
  const projectId = (await params).id;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  // Use the standard server client to read the user session from cookies
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if the project exists and belongs to the user or their team
    const { data: existingProject, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to delete this project
    // They must be either the creator or on the same team
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("team")
      .eq("id", user.id)
      .single();

    const isAuthorized =
      (existingProject.teamId === null && existingProject.userId === user.id) ||
      (existingProject.teamId !== null &&
        existingProject.teamId === userProfile?.team);

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "You are not authorized to delete this project" },
        { status: 403 }
      );
    }

    // Delete the project
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      throw new Error(`Error deleting project: ${deleteError.message}`);
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project", error },
      { status: 500 }
    );
  }
}
