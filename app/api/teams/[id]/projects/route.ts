import { NextResponse } from "next/server";
import { getProjectsByTeam } from "@/utils/supabase/data-services";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const teamId = (await params).id;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Get team projects
    const projects = await getProjectsByTeam(parseInt(teamId, 10));

    // Return 404 if no projects were found for this team
    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { message: "No projects found for this team" },
        { status: 404 }
      );
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error(`Error fetching team projects:`, error);
    return NextResponse.json(
      { error: "Failed to fetch team projects" },
      { status: 500 }
    );
  }
}
