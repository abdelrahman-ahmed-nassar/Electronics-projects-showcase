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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db
            .insert(schema.profiles)
            .values({ id: user.id, name: user.name, isGraduated: false })
            .onConflictDoNothing();
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
