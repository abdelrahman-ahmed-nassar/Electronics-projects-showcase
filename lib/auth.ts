import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { verifyPassword } from "better-auth/crypto";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      phone: { type: "string", required: false, input: true },
      nationalId: { type: "string", required: false, input: false },
      isGraduated: { type: "boolean", required: false, defaultValue: false, input: true },
      about: { type: "string", required: false, input: true },
      specialization: { type: "string", required: false, input: true },
      role: { type: "string", required: false, input: false },
      skills: { type: "string", required: false, input: true },
      teamId: { type: "number", required: false, input: true },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    password: {
      verify: async ({ hash, password }) => {
        if (hash.startsWith("$2")) return bcrypt.compare(password, hash);
        return verifyPassword({ hash, password });
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
