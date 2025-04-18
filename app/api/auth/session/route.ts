import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  try {
    // First get the session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Then get the user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Fetch additional user data from profile table with correct id column
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    // Combine user data
    const userData = {
      id: user.id,
      email: user.email,
      // ...user.user_metadata,
      ...(profile || {}),
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
