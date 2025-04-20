import { NextResponse } from "next/server";
import { getTeamById, getProfilesByTeam } from "@/utils/supabase/data-services";
import { createServiceClient } from "@/utils/supabase/server-service";
import { createClient } from "@/utils/supabase/server";

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

    // Get team data
    const team = await getTeamById(parseInt(teamId));

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Get team members
    const members = await getProfilesByTeam(parseInt(teamId));

    // Process team data for frontend
    let achievementsList: string[] = [];
    if (team.achievements) {
      // Check if it's already an array
      if (Array.isArray(team.achievements)) {
        achievementsList = team.achievements;
      }
      // Handle string format
      else if (typeof team.achievements === "string") {
        // Split by commas and trim each value
        achievementsList = team.achievements
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0);
      }
    }

    // Ensure there's at least one achievement for display purposes
    if (achievementsList.length === 0) {
      achievementsList = [
        "Established research team in electronics engineering",
      ];
    }

    // Format the response
    const response = {
      team: {
        ...team,
        achievements: achievementsList,
        image: team.image || "/images/default-team-image.png",
        specialty: team.specialty || "Electronics Research",
      },
      members: members || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error fetching team:`, error);
    return NextResponse.json(
      { error: "Failed to fetch team data" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // First, authenticate the user
    const standardClient = await createClient();
    const {
      data: { user },
    } = await standardClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get team data from request body
    const teamData = await request.json();

    // Use service client for admin operations
    const serviceClient = createServiceClient();

    // Update team
    const { data, error } = await serviceClient
      .from("teams")
      .update({
        name: teamData.name || null,
        description: teamData.description || null,
        specialty: teamData.specialty || null,
        achievements: teamData.achievements || null,
        image: teamData.image || null,
        isFeatured: teamData.isFeatured || false,
      })
      .eq("id", teamId)
      .select()
      .single();

    if (error) {
      console.error("Team update error:", error);
      return NextResponse.json(
        { error: `Failed to update team: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating team:`, error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update team",
      },
      { status: 500 }
    );
  }
}
