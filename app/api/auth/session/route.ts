import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProfileById } from "@/utils/db/data-services";

export async function GET() {
  const cacheHeaders = {
    "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
  };

  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200, headers: cacheHeaders });
    }

    const profile = await getProfileById(session.user.id);

    const userData = {
      id: session.user.id,
      email: session.user.email,
      name: profile?.name ?? session.user.name,
      phone: profile?.phone,
      nationalId: profile?.nationalId,
      avatarImage: profile?.avatarImage,
      isGraduated: profile?.isGraduated,
      about: profile?.about,
      specialization: profile?.specialization,
      role: profile?.role,
      team: profile?.team,
      skills: profile?.skills,
    };

    return NextResponse.json({ user: userData }, { headers: cacheHeaders });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
