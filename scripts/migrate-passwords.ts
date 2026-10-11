import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const supabaseDbUrl = process.env.SUPABASE_DATABASE_URL;
if (!supabaseDbUrl) throw new Error("SUPABASE_DATABASE_URL is required");

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function main() {
  const caPath = process.env.SUPABASE_CA_CERT_PATH;
  const source = new Client({
    connectionString: supabaseDbUrl,
    ssl: caPath ? { ca: readFileSync(caPath, "utf8"), rejectUnauthorized: true } : true,
  });
  await source.connect();

  try {
    const { rows } = await source.query<{ id: string; encrypted_password: string }>(
      `select id::text as id, encrypted_password
       from auth.users
       where encrypted_password is not null and encrypted_password <> ''`
    );

    const existing = await db
      .select({ userId: schema.account.userId })
      .from(schema.account)
      .where(eq(schema.account.providerId, "credential"));
    const haveCredential = new Set(existing.map((r) => r.userId));

    const now = new Date();
    const toInsert = rows
      .filter((r) => !haveCredential.has(r.id))
      .map((r) => ({
        id: randomUUID(),
        accountId: r.id,
        providerId: "credential",
        userId: r.id,
        password: r.encrypted_password,
        createdAt: now,
        updatedAt: now,
      }));

    for (let i = 0; i < toInsert.length; i += 100) {
      await db.insert(schema.account).values(toInsert.slice(i, i + 100));
    }

    console.log(
      `Supabase users with password: ${rows.length}; already had credential account: ${rows.length - toInsert.length}; inserted: ${toInsert.length}`
    );
  } finally {
    await source.end();
  }
}

main().catch((err) => {
  console.error("Password migration failed:", (err as Error).message.slice(0, 200));
  process.exit(1);
});
