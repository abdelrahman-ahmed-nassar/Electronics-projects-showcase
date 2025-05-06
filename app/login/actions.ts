"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getProfileById } from "@/utils/supabase/data-services";
import { UserInterface } from "@/app/Types";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  ////////////////////////

  console.log("Login data:", { email: loginData.email, passwordProvided: !!loginData.password });
  try {
    const { error, data } = await supabase.auth.signInWithPassword(loginData);
    console.log(data)
    console.log("Auth response:", error ? { error } : { success: true });
    // ...existing code...
  } catch (e) {
    console.error("Unexpected exception during auth:", e);
    // Handle the error appropriately
  }
  






  /////////////
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
  // Use a type compatible with both initial data and profile data
  let userData: Partial<UserInterface> = {
    id: data.user?.id,
    email: data.user?.email || null, // Make sure email is compatible with UserInterface
  };

  try {
    if (data.user?.id) {
      // Use getProfileById from data-services instead of direct Supabase query
      const profile = await getProfileById(data.user.id);

      if (profile) {
        userData = {
          ...userData,
          ...profile,
          // Ensure id is from auth, not profile table
          id: data.user.id,
        };
      } else {
        console.log("No profile found for user ID:", data.user.id);
      }
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }

  // Revalidate paths that might depend on authentication state
  revalidatePath("/", "layout");

  return { success: true, userData };
}
