import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileData = await request.json();

    const updates: Partial<typeof profiles.$inferInsert> = {};
    if ("name" in profileData) updates.name = profileData.name || null;
    if ("phone" in profileData) updates.phone = profileData.phone || null;
    if ("nationalId" in profileData) updates.nationalId = profileData.nationalId || null;
    if ("avatarImage" in profileData) updates.avatarImage = profileData.avatarImage || null;
    if ("isGraduated" in profileData) updates.isGraduated = Boolean(profileData.isGraduated);
    if ("about" in profileData) updates.about = profileData.about || null;
    if ("skills" in profileData) updates.skills = profileData.skills || null;
    if ("specialization" in profileData) updates.specialization = profileData.specialization || null;
    if ("role" in profileData) updates.role = profileData.role || null;
    if ("team" in profileData) updates.team = profileData.team || null;

    const [result] = await db
      .insert(profiles)
      .values({ id: session.user.id, ...updates })
      .onConflictDoUpdate({
        target: profiles.id,
        set: Object.keys(updates).length > 0 ? updates : { id: session.user.id },
      })
      .returning();

    return NextResponse.json({ profile: result });
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
