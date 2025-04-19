import { NextResponse } from "next/server";
import { getProjectsByTeam } from "@/utils/supabase/data-services";

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const teamId = parseInt(params.teamId, 10);

  if (isNaN(teamId)) {
    return NextResponse.json({ message: "Invalid team ID" }, { status: 400 });
  }

  try {
    const projects = await getProjectsByTeam(teamId);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching team projects:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch team projects",
      },
      { status: 500 }
    );
  }
}
