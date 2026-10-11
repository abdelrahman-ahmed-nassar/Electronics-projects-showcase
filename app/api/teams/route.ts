import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  getAllTeams,
  getProfilesByTeam,
  getProjectsByTeam,
} from "@/utils/db/data-services";

export async function GET() {
  try {
    const allTeams = await getAllTeams();

    const teamsWithData = await Promise.all(
      allTeams.map(async (team) => {
        try {
          const members = await getProfilesByTeam(team.id);
          const projects = await getProjectsByTeam(team.id);

          let achievementsList: string[] = team.achievements
            ? team.achievements
                .split(",")
                .map((a) => a.trim())
                .filter((a) => a.length > 0)
            : [];

          if (achievementsList.length === 0) {
            achievementsList = [
              "Established research team in electronics engineering",
            ];
          }

          const formattedMembers = members.map((member) => ({
            name: member.name || "Unknown",
            role: member.role || member.specialization || "Team Member",
            bio: member.about || "No bio available",
            image:
              member.avatarImage || "/images/default-user-profile-image.svg",
          }));

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
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teamData = await request.json();

    if (!teamData.name || !teamData.description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    const [data] = await db
      .insert(teams)
      .values({
        name: teamData.name,
        description: teamData.description,
        achievements: teamData.achievements || null,
        specialty: teamData.specialty || null,
        image: teamData.image || null,
      })
      .returning();

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
