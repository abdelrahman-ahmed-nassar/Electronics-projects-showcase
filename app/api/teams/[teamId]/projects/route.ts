import { NextRequest, NextResponse } from "next/server";
import { getProjectsByTeam } from "@/utils/supabase/data-services";

// Define the API route handler to handle params as a Promise
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    // Await the params Promise to get the actual params
    const params = await context.params;
    const teamId = parseInt(params.teamId, 10);

    if (isNaN(teamId)) {
      return NextResponse.json({ message: "Invalid team ID" }, { status: 400 });
    }

    const projects = await getProjectsByTeam(teamId);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching team projects:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
