"use server";

import { createClient } from "@/utils/supabase/server";

export async function register(formData: FormData) {
  const supabase = await createClient();


  // Extract form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs (basic validation)
  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters",
    };
  }

  try {

    // Use Supabase's signUp method - this creates an unverified user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    // Registration successful, but email needs to be confirmed
    return {
      success: true,
      message:
        "Registration successful. Your account needs to be verified by an administrator before you can log in.",
      userId: data.user?.id,
    };
  } catch (error) {
    console.error("Unexpected registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
