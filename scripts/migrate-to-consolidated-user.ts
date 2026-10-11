import "dotenv/config";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required in environment");
}

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to database successfully.");

  try {
    // 1. Check if profiles table exists
    const tableCheck = await client.query(`
      SELECT to_regclass('public.profiles') as exists;
    `);

    const profilesExists = Boolean(tableCheck.rows[0]?.exists);
    console.log(`Profiles table exists: ${profilesExists}`);

    // 2. Add columns to "user" table if they don't exist
    console.log("Adding profile columns to 'user' table if missing...");
    await client.query(`
      ALTER TABLE "user"
        ADD COLUMN IF NOT EXISTS "phone" text,
        ADD COLUMN IF NOT EXISTS "nationalId" text,
        ADD COLUMN IF NOT EXISTS "isGraduated" boolean DEFAULT false NOT NULL,
        ADD COLUMN IF NOT EXISTS "about" text,
        ADD COLUMN IF NOT EXISTS "specialization" text,
        ADD COLUMN IF NOT EXISTS "role" text,
        ADD COLUMN IF NOT EXISTS "skills" text,
        ADD COLUMN IF NOT EXISTS "teamId" bigint;
    `);

    // 3. Add foreign key and index on teamId
    console.log("Ensuring foreign key and index on user.teamId...");
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'user_teamId_teams_id_fk'
        ) THEN
          ALTER TABLE "user"
            ADD CONSTRAINT "user_teamId_teams_id_fk"
            FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id")
            ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS "user_teamId_idx" ON "user" ("teamId");
    `);

    if (profilesExists) {
      // 4. Check counts before migration
      const profileCountRes = await client.query('SELECT count(*)::int as count FROM "profiles";');
      const userCountRes = await client.query('SELECT count(*)::int as count FROM "user";');
      console.log(`Current state: ${userCountRes.rows[0].count} users, ${profileCountRes.rows[0].count} profiles.`);

      // 5. Create backup table
      console.log("Creating 'profiles_backup' table for safety...");
      await client.query(`
        CREATE TABLE IF NOT EXISTS "profiles_backup" AS SELECT * FROM "profiles";
      `);

      // 6. Migrate data from profiles to user
      console.log("Migrating profile data into 'user'...");
      const updateResult = await client.query(`
        UPDATE "user" u
        SET
          image = COALESCE(u.image, p."avatarImage"),
          phone = COALESCE(u.phone, p."phone"),
          "nationalId" = COALESCE(u."nationalId", p."nationalId"),
          "isGraduated" = COALESCE(p."isGraduated", false),
          about = COALESCE(u.about, p."about"),
          specialization = COALESCE(u.specialization, p."specialization"),
          role = COALESCE(u.role, p."role"),
          skills = COALESCE(u.skills, p."skills"),
          "teamId" = COALESCE(u."teamId", p."team")
        FROM "profiles" p
        WHERE u.id = p.id;
      `);
      console.log(`Updated ${updateResult.rowCount} user rows with profile data.`);

      // 7. Drop legacy profiles table
      console.log("Dropping legacy 'profiles' table...");
      await client.query(`
        DROP TABLE IF EXISTS "profiles" CASCADE;
      `);
      console.log("Legacy 'profiles' table dropped successfully (backup remains in 'profiles_backup').");
    } else {
      console.log("Profiles table already migrated or does not exist.");
    }

    // 8. Verification query
    const sampleRes = await client.query(`
      SELECT id, name, email, phone, role, specialization, "teamId", "isGraduated"
      FROM "user"
      LIMIT 3;
    `);
    console.log("Sample migrated users:", JSON.stringify(sampleRes.rows, null, 2));

    const counts = await client.query(`
      SELECT
        count(*)::int as total_users,
        count("teamId")::int as users_in_teams,
        count(phone)::int as users_with_phone,
        count(specialization)::int as users_with_specialization
      FROM "user";
    `);
    console.log("Verification summary:", counts.rows[0]);

    console.log("Migration completed successfully!");
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
