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

    const values = {
      name: profileData.name || null,
      phone: profileData.phone || null,
      nationalId: profileData.nationalId || null,
      avatarImage: profileData.avatarImage || null,
      isGraduated:
        profileData.isGraduated !== undefined ? profileData.isGraduated : false,
      about: profileData.about || null,
      skills: profileData.skills || null,
      specialization: profileData.specialization || null,
      role: profileData.role || null,
      team: profileData.team || null,
    };

    const [result] = await db
      .insert(profiles)
      .values({ id: session.user.id, ...values })
      .onConflictDoUpdate({ target: profiles.id, set: values })
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
