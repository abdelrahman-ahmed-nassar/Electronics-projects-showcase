import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Sign out from Supabase Auth to clear server-side session
    await supabase.auth.signOut();

    // Create a response with cookies cleared
    const response = NextResponse.json({
      success: true,
      message: "Session cleared successfully",
    });

    // Clear cookies by setting them to expire in the past
    // Auth cookies
    response.cookies.set("isAuthenticated", "", {
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("user", "", {
      expires: new Date(0),
      path: "/",
    });

    // Supabase auth cookies
    response.cookies.set("sb-access-token", "", {
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("sb-refresh-token", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error clearing session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear session" },
      { status: 500 }
    );
  }
}
