"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

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

  const u = session.user;
  return {
    success: true,
    user: {
      ...u,
      avatarImage: u.avatarImage || u.image || null,
      team: u.team ?? u.teamId ?? null,
    },
  };
}
