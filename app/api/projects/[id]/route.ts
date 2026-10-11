import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@/lib/auth";

async function findProject(id: number) {
  const [existing] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return existing ?? null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const projectId = (await params).id;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(projectId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const projectData = await request.json();

    const existing = await findProject(id);
    if (!existing) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const updates: Partial<typeof projects.$inferInsert> = {};
    if ("title" in projectData) updates.title = projectData.title || null;
    if ("description" in projectData) updates.description = projectData.description || null;
    if ("image" in projectData) updates.image = projectData.image || null;
    if ("tags" in projectData) updates.tags = projectData.tags || [];
    if ("period" in projectData) updates.period = projectData.period || null;
    if ("link" in projectData) updates.link = projectData.link || null;
    if ("isFeatured" in projectData) updates.isFeatured = Boolean(projectData.isFeatured);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing);
    }

    const [updatedProject] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Failed to update project", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const projectId = (await params).id;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(projectId, 10);
    if (isNaN(id) || !(await findProject(id))) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    await db.delete(projects).where(eq(projects.id, id));

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project", error: String(error) },
      { status: 500 }
    );
  }
}
