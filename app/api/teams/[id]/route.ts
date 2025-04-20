import { NextResponse } from "next/server";
import {
  getTeamById,
  getProfilesByTeam,
  getProjectsByTeam,
} from "@/utils/supabase/data-services";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Get team data
    const team = await getTeamById(teamId);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Get team members
    const members = await getProfilesByTeam(teamId);

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
