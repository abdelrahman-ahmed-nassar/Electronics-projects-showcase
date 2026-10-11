"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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

  const u = result.user as unknown as Partial<UserInterface> & typeof result.user;
  const userData: Partial<UserInterface> = {
    ...u,
    avatarImage: u.avatarImage || u.image || null,
    team: u.team ?? u.teamId ?? null,
  };

  revalidatePath("/", "layout");

  return { success: true, userData };
}
