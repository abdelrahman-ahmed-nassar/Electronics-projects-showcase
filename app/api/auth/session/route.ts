import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getProfileById } from "@/utils/supabase/data-services";

export async function GET() {
  const supabase = await createClient();
  try {
    // Add cache headers to prevent excessive requests
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, max-age=60"); // Cache for 1 minute on client side

    // First get the session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.json(
        { user: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "private, max-age=60",
          },
        }
      );
    }

    if (!session) {
      return NextResponse.json(
        { user: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "private, max-age=60",
          },
        }
      );
    }

    // Then get the user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { user: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "private, max-age=60",
          },
        }
      );
    }

    // Use getProfileById from data-services instead of direct Supabase query
    const profile = await getProfileById(user.id);

    // Combine user data
    const userData = {
      id: user.id,
      email: user.email, // Email comes from auth, not profiles table
      name: profile?.name,
      phone: profile?.phone,
      nationalId: profile?.nationalId,
      yearId: profile?.yearId,
      avatarImage: profile?.avatarImage,
      isGraduated: profile?.isGraduated,
      about: profile?.about,
      specialization: profile?.specialization,
      role: profile?.role,
      team: profile?.team,
      skills: profile?.skills,
    };

    return NextResponse.json(
      { user: userData },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
