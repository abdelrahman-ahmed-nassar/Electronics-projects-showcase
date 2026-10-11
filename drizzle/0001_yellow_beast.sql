ALTER TABLE IF EXISTS "profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE IF EXISTS "profiles" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "nationalId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isGraduated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "about" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "specialization" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "skills" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "teamId" bigint;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_teamId_teams_id_fk') THEN
    ALTER TABLE "user" ADD CONSTRAINT "user_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_teamId_idx" ON "user" USING btree ("teamId");