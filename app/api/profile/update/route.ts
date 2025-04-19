import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    // First, authenticate the user
    const standardClient = await createClient();
    const {
      data: { user },
    } = await standardClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile data from request body
    const profileData = await request.json();

    // Ensure skills is properly formatted as an array
    let skillsArray = profileData.skills;
    if (typeof profileData.skills === "string") {
      // Convert comma-separated string to array
      skillsArray = profileData.skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter(Boolean);
    } else if (!Array.isArray(profileData.skills)) {
      // Default to empty array if not provided or invalid format
      skillsArray = [];
    }

    // Use service client for admin operations
    const serviceClient = createServiceClient();

    // Check if profile exists
    const { data: existingProfile } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await serviceClient
        .from("profiles")
        .update({
          name: profileData.name || null,
          phone: profileData.phone || null,
          yearId: profileData.yearId || null,
          nationalId: profileData.nationalId || null,
          avatarImage: profileData.avatarImage || null,
          isGraduated:
            profileData.isGraduated !== undefined
              ? profileData.isGraduated
              : false,
          about: profileData.about || null,
          skills: skillsArray, // Use the properly formatted array
          specialization: profileData.specialization || null,
          role: profileData.role || null,
          team: profileData.team || null,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }
      result = data;
    } else {
      // Create new profile
      const { data, error } = await serviceClient
        .from("profiles")
        .insert([
          {
            id: user.id, // Important: use the auth user id
            name: profileData.name || null,
            phone: profileData.phone || null,
            yearId: profileData.yearId || null,
            nationalId: profileData.nationalId || null,
            avatarImage: profileData.avatarImage || null,
            isGraduated:
              profileData.isGraduated !== undefined
                ? profileData.isGraduated
                : false,
            about: profileData.about || null,
            skills: skillsArray, // Use the properly formatted array
            specialization: profileData.specialization || null,
            role: profileData.role || null,
            team: profileData.team || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Profile creation error:", error);
        throw error;
      }
      result = data;
    }

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
