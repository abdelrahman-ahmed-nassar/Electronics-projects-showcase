"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });

    if (!result.user) {
      return { success: false, error: "Failed to create user" };
    }

    return {
      success: true,
      message: "Registration successful! You can now log in with your credentials.",
      userId: result.user.id,
    };
  } catch (error) {
    const errorCode =
      (error as { body?: { code?: string } }).body?.code ?? "UNKNOWN_ERROR";
    console.error("Registration error:", errorCode);
    return { success: false, error: errorCode };
  }
}
