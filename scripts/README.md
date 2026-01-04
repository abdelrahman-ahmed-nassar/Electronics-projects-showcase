# Image Migration Scripts

Step-by-step migration from Supabase Storage to Cloudinary.

## Prerequisites

1. Install tsx: `pnpm i -D tsx`
2. Ensure `.env` has:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLOUDINARY_URL`

## Migration Steps

### Step 1: Upload Default Images

```bash
tsx scripts/1-upload-default-images.ts
```

- Uploads 3 default fallback images to Cloudinary
- Must succeed before proceeding

### Step 2: Migrate Profile Images

```bash
tsx scripts/2-migrate-profile-images.ts
```

- Migrates all user avatar images
- Creates `migration-results-profiles.json`
- Verify results before proceeding

### Step 3: Migrate Team Images

```bash
tsx scripts/3-migrate-team-images.ts
```

- Migrates all team logo images
- Creates `migration-results-teams.json`
- Verify results before proceeding

### Step 4: Migrate Project Images

```bash
tsx scripts/4-migrate-project-images.ts
```

- Migrates all project images
- Creates `migration-results-projects.json`
- Final step!

## Safety Features

- Each script is independent
- Skips already-migrated images
- Detailed progress logging
- JSON reports for each step
- No deletion of Supabase images
- Database rollback possible (old URLs preserved in JSON)

## After Migration

Run all 4 scripts in order, verifying each step succeeds before proceeding to the next.
