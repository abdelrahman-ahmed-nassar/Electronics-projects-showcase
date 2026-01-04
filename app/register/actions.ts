"use server";

import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/server-service";

export async function register(formData: FormData) {
  const supabase = await createClient();

  // Extract form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs (basic validation)
  if (!name || !email || !password) {
    return {
      success: false,
      error: "Name, email and password are required",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters",
    };
  }

  try {
    // Use Supabase's signUp method with auto-confirm
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
        data: {
          email_confirm: true,
        },
      },
    });

    if (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Failed to create user",
      };
    }

    // Create profile using service client (admin privileges)
    const serviceClient = createServiceClient();

    const { error: profileError } = await serviceClient
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          name: name,
          avatarImage: null,
          phone: null,
          nationalId: null,
          isGraduated: false,
          about: null,
          specialization: null,
          role: null,
          team: null,
          skills: null,
        },
      ]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail the registration if profile creation fails
      // The profile can be created later
    }

    // Registration successful and auto-confirmed
    return {
      success: true,
      message:
        "Registration successful! You can now log in with your credentials.",
      userId: data.user.id,
    };
  } catch (error) {
    console.error("Unexpected registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
