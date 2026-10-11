import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getTeamById, getProfilesByTeam } from "@/utils/db/data-services";
import { CLOUDINARY_DEFAULTS } from "@/utils/cloudinary/helpers";

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

    const team = await getTeamById(parseInt(teamId, 10));

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await getProfilesByTeam(parseInt(teamId, 10));

    const response = {
      team: {
        ...team,
        image: team.image || CLOUDINARY_DEFAULTS.team,
        specialty: team.specialty || "Unspecified",
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

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamData = await request.json();

    const [data] = await db
      .update(teams)
      .set({
        name: teamData.name || null,
        description: teamData.description || null,
        specialty: teamData.specialty || null,
        achievements: teamData.achievements || null,
        image: teamData.image || null,
        isFeatured: teamData.isFeatured || false,
      })
      .where(eq(teams.id, parseInt(teamId, 10)))
      .returning();

    if (!data) {
      return NextResponse.json(
        { error: "Failed to update team: not found" },
        { status: 404 }
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
