"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProfileById } from "@/utils/db/data-services";
import { UserInterface } from "@/app/Types";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let result;
  try {
    result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (error) {
    const errorCode =
      (error as { body?: { code?: string } }).body?.code ?? "UNKNOWN_ERROR";
    console.log("Login error:", errorCode);
    return { success: false, error: errorCode };
  }

  const userId = result.user.id;
  let userData: Partial<UserInterface> = {
    id: userId,
    email: result.user.email,
  };

  try {
    const profile = await getProfileById(userId);
    if (profile) {
      userData = { ...userData, ...profile, id: userId };
    } else {
      console.log("No profile found for user ID:", userId);
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }

  revalidatePath("/", "layout");

  return { success: true, userData };
}
