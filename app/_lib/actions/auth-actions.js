"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Logs out a user from the application by clearing Supabase session
 * and browser cookies
 */
export async function logoutUser() {
  const supabase = await createClient();

  // Clear Supabase session
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error);
    return { success: false, error: error.message };
  }

  // Clear any auth-related cookies - properly awaited
  const cookieStore = await cookies();
  cookieStore.delete("isAuthenticated");
  cookieStore.delete("user");

  // Revalidate the home page and layout to reflect logged-out state
  revalidatePath("/", "layout");

  return { success: true };
}

/**
 * Gets the current authenticated user's data
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, user: null };
  }

  // Fetch additional user profile data if needed
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      // ...user.user_metadata,
      ...profile,
    },
  };
}
