"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log(loginData)
  const { error, data } = await supabase.auth.signInWithPassword(loginData);

  if (error) {
    console.log("Login error:", error);

    // Extract the error code for proper translation
    const errorCode = error.code || error.message;

    // Check if the error is related to unconfirmed email
    const isEmailUnconfirmed =
      errorCode === "email_not_confirmed" ||
      error.message?.includes("Email not confirmed");

    // Return both the error code (for translation) and email unconfirmed flag
    return {
      success: false,
      error: errorCode,
      isEmailUnconfirmed,
      email: isEmailUnconfirmed ? loginData.email : undefined,
    };
  }

  // Create comprehensive user data by fetching profile information
  let userData = {
    id: data.user?.id,
    email: data.user?.email,
  };

  try {
    if (data.user?.id) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!profileError && profiles) {
        userData = {
          ...userData,
          ...profiles,
          // Ensure id is from auth, not profile table
          id: data.user.id,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }

  // Revalidate paths that might depend on authentication state
  revalidatePath("/", "layout");

  return { success: true, userData };
}
