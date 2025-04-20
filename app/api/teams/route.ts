import { NextResponse } from "next/server";
import {
  getAllTeams,
  getProfilesByTeam,
  getProjectsByTeam,
} from "@/utils/supabase/data-services";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/server-service";

export async function GET() {
  try {
    // Get all teams from the database
    const teams = await getAllTeams();

    // For each team, get members and projects
    const teamsWithData = await Promise.all(
      teams.map(async (team) => {
        try {
          // Get team members
          const members = await getProfilesByTeam(team.id);

          // Get team projects
          const projects = await getProjectsByTeam(team.id);

          // Handle achievements - stored as comma-separated values
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

          // Ensure each team has at least one achievement for display purposes
          if (achievementsList.length === 0) {
            achievementsList = [
              "Established research team in electronics engineering",
            ];
          }

          // Transform members to the format expected by the UI
          const formattedMembers = members.map((member) => ({
            name: member.name || "Unknown",
            role: member.role || member.specialization || "Team Member",
            bio: member.about || "No bio available",
            image:
              member.avatarImage || "/images/default-user-profile-image.svg",
          }));

          // Return the team with enhanced data
          return {
            ...team,
            achievements: achievementsList,
            members: formattedMembers,
            projects: projects.map((p) => p.title || "Untitled Project"),
            image: team.image || "/images/default-team-image.png",
            specialty: team.specialty || "Electronics Research",
          };
        } catch (error) {
          console.error(`Error enhancing team ${team.id}:`, error);
          return {
            ...team,
            achievements: [
              "Established research team in electronics engineering",
            ],
            members: [],
            projects: [],
            image: "/images/default-team-image.png",
            specialty: team.specialty || "Electronics Research",
          };
        }
      })
    );

    return NextResponse.json(teamsWithData);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    // Validate required fields
    if (!teamData.name || !teamData.description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    // Use service client for admin operations
    const serviceClient = createServiceClient();

    // Insert new team
    const { data, error } = await serviceClient
      .from("teams")
      .insert([
        {
          name: teamData.name,
          description: teamData.description,
          achievements: teamData.achievements || null,
          specialty: teamData.specialty || null,
          image: teamData.image || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Team creation error:", error);
      return NextResponse.json(
        { message: `Error creating team: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API Route: Error during team creation:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create team due to an unknown server error";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
