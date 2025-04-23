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
    // Try to sign in with the email, which is a reliable way to check if the email exists
    // We'll use a deliberately wrong password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: "wrong-password-for-checking-only",
    });

    // If the error message contains "Invalid login credentials", it means the email exists
    // but the password is wrong, confirming the email is registered
    if (
      signInError &&
      !signInError.message.includes("Invalid login credentials") &&
      (signInError.message.includes("Email not confirmed") ||
        signInError.message.includes("already registered"))
    ) {
      return {
        success: false,
        error:
          "This email is already registered. Please use a different email or try to log in.",
      };
    }

    // Use Supabase's signUp method - this creates an unverified user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Important: We're NOT auto-confirming the email
        // The user will need manual verification from Supabase dashboard
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (error) {
      console.error("Registration error:", error);

      // Check if the error is due to the email already being in use
      if (
        error.message.includes("already registered") ||
        error.message.includes("already in use") ||
        error.message.includes("already exists") ||
        error.message.includes("User already exists")
      ) {
        return {
          success: false,
          error:
            "This email is already registered. Please use a different email or try to log in.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    // When a user tries to sign up with an existing email, check the user data carefully
    // In Supabase, if a user already exists, the identities array in response will be empty
    if (
      !data.user ||
      (data.user.identities && data.user.identities.length === 0) ||
      !data.session
    ) {
      // If there's no session, it's likely an existing account
      return {
        success: false,
        error:
          "This email is already registered. Please use a different email or try to log in.",
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
