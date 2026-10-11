import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  uploadProject,
  getProjectsForDisplay,
} from "@/utils/db/data-services";
import { auth } from "@/lib/auth";
import { ProjectInterface } from "@/app/Types";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawData = await request.json();

    const tagsArray = rawData.tags
      ? Array.isArray(rawData.tags)
        ? rawData.tags.filter((tag: string) => tag.trim() !== "")
        : rawData.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag !== "")
      : null;

    const projectData: Omit<ProjectInterface, "id" | "created_at"> = {
      title: rawData.title || null,
      description: rawData.description || null,
      image: rawData.image || null,
      tags: tagsArray,
      period: rawData.period || null,
      link: rawData.link || null,
      teamId: rawData.teamId ? parseInt(rawData.teamId, 10) : null,
      isFeatured: rawData.isFeatured || false,
    };

    if (!projectData.title || !projectData.description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    const newProject = await uploadProject(projectData);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("API Route: Error during project upload:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload project due to an unknown server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const projects = await getProjectsForDisplay(startDate, endDate);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("API Route GET /api/projects error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
