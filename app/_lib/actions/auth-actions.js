"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getProfileById } from "@/utils/db/data-services";

export async function logoutUser() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");

  return { success: true };
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, user: null };
  }

  const profile = await getProfileById(session.user.id);

  return {
    success: true,
    user: {
      id: session.user.id,
      email: session.user.email,
      ...profile,
    },
  };
}
