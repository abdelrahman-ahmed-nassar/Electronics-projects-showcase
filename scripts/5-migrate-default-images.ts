// Step 5: Migrate records using Supabase default images to Cloudinary defaults
// Run with: npx tsx scripts/5-migrate-default-images.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { getCloudinaryConfig } from "../utils/cloudinary/config";
import * as fs from "fs";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get Cloudinary config
const cloudinaryConfig = getCloudinaryConfig();
const cloudName = cloudinaryConfig.cloudName;

// Mapping of Supabase default images to Cloudinary URLs
const DEFAULT_IMAGE_MAPPINGS = {
  profile: {
    supabaseUrls: [
      "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/profiles-images/default-user-profile.svg",
      "/images/default-user-profile.svg",
    ],
    cloudinaryUrl: `https://res.cloudinary.com/${cloudName}/image/upload/profiles/default-user-profile`,
  },
  team: {
    supabaseUrls: [
      "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/teams-images/default-team-image.png",
      "/images/default-team-image.png",
    ],
    cloudinaryUrl: `https://res.cloudinary.com/${cloudName}/image/upload/teams/default-team-image`,
  },
  project: {
    supabaseUrls: [
      "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/projects-images/default-project-image.png",
      "/images/default-project-image.png",
    ],
    cloudinaryUrl: `https://res.cloudinary.com/${cloudName}/image/upload/projects/default-project-image`,
  },
};

interface MigrationResult {
  table: string;
  recordId: number;
  oldUrl: string;
  newUrl: string;
  success: boolean;
  error?: string;
}

function isDefaultSupabaseImage(
  url: string | null,
  type: keyof typeof DEFAULT_IMAGE_MAPPINGS
): boolean {
  if (!url) return false;

  // Check if URL contains "default-" followed by the type name
  const patterns = [
    "default-user-profile",
    "default-team-image",
    "default-project-image",
  ];

  // Also check against the configured URLs
  return (
    DEFAULT_IMAGE_MAPPINGS[type].supabaseUrls.some(
      (defaultUrl) => url.includes(defaultUrl) || url === defaultUrl
    ) || patterns.some((pattern) => url.includes(pattern))
  );
}

async function migrateDefaultImages() {
  console.log(
    "🔄 Migrating default Supabase images to Cloudinary defaults...\n"
  );

  const results: MigrationResult[] = [];

  // 1. Migrate profiles with default images
  console.log("👤 Checking profiles...");
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, avatarImage")
    .not("avatarImage", "is", null);

  if (profilesError) {
    console.error("❌ Error fetching profiles:", profilesError);
  } else {
    const defaultProfiles =
      profiles?.filter((p) =>
        isDefaultSupabaseImage(p.avatarImage, "profile")
      ) || [];

    console.log(
      `   Found ${defaultProfiles.length} profiles with default images`
    );

    for (const profile of defaultProfiles) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatarImage: DEFAULT_IMAGE_MAPPINGS.profile.cloudinaryUrl })
        .eq("id", profile.id);

      results.push({
        table: "profiles",
        recordId: profile.id,
        oldUrl: profile.avatarImage,
        newUrl: DEFAULT_IMAGE_MAPPINGS.profile.cloudinaryUrl,
        success: !updateError,
        error: updateError?.message,
      });
    }

    console.log(`   ✅ Updated ${defaultProfiles.length} profiles\n`);
  }

  // 2. Migrate teams with default images
  console.log("👥 Checking teams...");
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, image")
    .not("image", "is", null);

  if (teamsError) {
    console.error("❌ Error fetching teams:", teamsError);
  } else {
    const defaultTeams =
      teams?.filter((t) => isDefaultSupabaseImage(t.image, "team")) || [];

    console.log(`   Found ${defaultTeams.length} teams with default images`);

    for (const team of defaultTeams) {
      const { error: updateError } = await supabase
        .from("teams")
        .update({ image: DEFAULT_IMAGE_MAPPINGS.team.cloudinaryUrl })
        .eq("id", team.id);

      results.push({
        table: "teams",
        recordId: team.id,
        oldUrl: team.image,
        newUrl: DEFAULT_IMAGE_MAPPINGS.team.cloudinaryUrl,
        success: !updateError,
        error: updateError?.message,
      });
    }

    console.log(`   ✅ Updated ${defaultTeams.length} teams\n`);
  }

  // 3. Migrate projects with default images
  console.log("📦 Checking projects...");
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, image")
    .not("image", "is", null);

  if (projectsError) {
    console.error("❌ Error fetching projects:", projectsError);
  } else {
    const defaultProjects =
      projects?.filter((p) => isDefaultSupabaseImage(p.image, "project")) || [];

    console.log(
      `   Found ${defaultProjects.length} projects with default images`
    );

    for (const project of defaultProjects) {
      const { error: updateError } = await supabase
        .from("projects")
        .update({ image: DEFAULT_IMAGE_MAPPINGS.project.cloudinaryUrl })
        .eq("id", project.id);

      results.push({
        table: "projects",
        recordId: project.id,
        oldUrl: project.image,
        newUrl: DEFAULT_IMAGE_MAPPINGS.project.cloudinaryUrl,
        success: !updateError,
        error: updateError?.message,
      });
    }

    console.log(`   ✅ Updated ${defaultProjects.length} projects\n`);
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY - DEFAULT IMAGES");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed migrations:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.table} (ID: ${r.recordId}): ${r.error}`);
      });
  }

  // Save results
  fs.writeFileSync(
    "migration-results-defaults.json",
    JSON.stringify(results, null, 2)
  );
  console.log(
    "\n📄 Detailed results saved to: migration-results-defaults.json"
  );

  if (successful === results.length && results.length > 0) {
    console.log("\n✨ All default images migrated successfully!");
  } else if (results.length === 0) {
    console.log("\n✨ No default images found to migrate!");
  } else {
    console.log("\n⚠️  Some migrations failed. Review the errors above.");
  }
}

async function main() {
  try {
    await migrateDefaultImages();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
