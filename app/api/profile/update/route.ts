import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileData = await request.json();

    const updates: Partial<typeof user.$inferInsert> = {};
    if ("name" in profileData) updates.name = profileData.name || null;
    if ("phone" in profileData) updates.phone = profileData.phone || null;
    if ("nationalId" in profileData) updates.nationalId = profileData.nationalId || null;
    if ("avatarImage" in profileData || "image" in profileData) {
      updates.image = profileData.avatarImage || profileData.image || null;
    }
    if ("isGraduated" in profileData) updates.isGraduated = Boolean(profileData.isGraduated);
    if ("about" in profileData) updates.about = profileData.about || null;
    if ("skills" in profileData) updates.skills = profileData.skills || null;
    if ("specialization" in profileData) updates.specialization = profileData.specialization || null;
    if ("role" in profileData) updates.role = profileData.role || null;
    if ("team" in profileData || "teamId" in profileData) {
      updates.teamId = profileData.team ?? profileData.teamId ?? null;
    }

    const [result] = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, session.user.id))
      .returning();

    const responseProfile = result
      ? {
          ...result,
          avatarImage: result.image,
          team: result.teamId,
        }
      : null;

    return NextResponse.json({ profile: responseProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
