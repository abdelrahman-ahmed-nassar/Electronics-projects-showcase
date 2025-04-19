import { NextResponse } from "next/server";
import { getAllTeams } from "@/utils/supabase/data-services";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/server-service";

export async function GET() {
  try {
    const teams = await getAllTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to fetch teams",
      },
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
