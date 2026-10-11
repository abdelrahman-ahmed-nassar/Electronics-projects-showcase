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
    const id = parseInt(teamId, 10);

    const updates: Partial<typeof teams.$inferInsert> = {};
    if ("name" in teamData) updates.name = teamData.name || null;
    if ("description" in teamData) updates.description = teamData.description || null;
    if ("specialty" in teamData) updates.specialty = teamData.specialty || null;
    if ("achievements" in teamData) updates.achievements = teamData.achievements || null;
    if ("image" in teamData) updates.image = teamData.image || null;
    if ("isFeatured" in teamData) updates.isFeatured = Boolean(teamData.isFeatured);

    const [data] =
      Object.keys(updates).length > 0
        ? await db.update(teams).set(updates).where(eq(teams.id, id)).returning()
        : await db.select().from(teams).where(eq(teams.id, id)).limit(1);

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
