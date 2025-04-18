import { NextResponse } from "next/server";
import { getAllTeams } from "@/utils/supabase/data-services";

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
