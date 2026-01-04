// Step 3: Migrate team images from Supabase to Cloudinary
// Run with: tsx scripts/3-migrate-team-images.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "../utils/cloudinary/config";
import * as fs from "fs";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Cloudinary
const cloudinaryConfig = getCloudinaryConfig();
cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

interface MigrationResult {
  teamId: number;
  teamName: string;
  oldUrl: string;
  newPublicId: string;
  newUrl: string;
  success: boolean;
  error?: string;
}

function isSupabaseImageUrl(url: string | null): boolean {
  if (!url) return false;
  return (
    url.includes("supabase.co/storage/v1/object/public") &&
    !url.includes("default-")
  );
}

async function uploadToCloudinary(
  imageUrl: string
): Promise<{ publicId: string; url: string } | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "teams",
      resource_type: "image",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error(
      `   Upload failed: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

async function migrateTeamImages() {
  console.log("🏆 Migrating team images from Supabase to Cloudinary...\n");

  // Fetch all teams with images
  const { data: teams, error } = await supabase
    .from("teams")
    .select("id, image, name")
    .not("image", "is", null);

  if (error) {
    console.error("❌ Error fetching teams:", error);
    process.exit(1);
  }

  console.log(`Found ${teams?.length || 0} teams with images\n`);

  const results: MigrationResult[] = [];
  const supabaseTeams = teams?.filter((t) => isSupabaseImageUrl(t.image)) || [];

  console.log(`${supabaseTeams.length} teams need migration\n`);

  if (supabaseTeams.length === 0) {
    console.log("✨ No teams to migrate!");
    return;
  }

  // Migrate each team
  for (let i = 0; i < supabaseTeams.length; i++) {
    const team = supabaseTeams[i];
    console.log(
      `[${i + 1}/${supabaseTeams.length}] Migrating: ${
        team.name || `Team ${team.id}`
      }`
    );
    console.log(`   Current URL: ${team.image}`);

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(team.image);

    if (!cloudinaryResult) {
      console.log(`   ❌ Failed to upload\n`);
      results.push({
        teamId: team.id,
        teamName: team.name || `Team ${team.id}`,
        oldUrl: team.image,
        newPublicId: "",
        newUrl: "",
        success: false,
        error: "Failed to upload to Cloudinary",
      });
      continue;
    }

    console.log(`   ✅ Uploaded to Cloudinary: ${cloudinaryResult.publicId}`);

    // Update database
    const { error: updateError } = await supabase
      .from("teams")
      .update({ image: cloudinaryResult.url })
      .eq("id", team.id);

    if (updateError) {
      console.log(`   ❌ Failed to update database: ${updateError.message}\n`);
      results.push({
        teamId: team.id,
        teamName: team.name || `Team ${team.id}`,
        oldUrl: team.image,
        newPublicId: cloudinaryResult.publicId,
        newUrl: cloudinaryResult.url,
        success: false,
        error: `Database update failed: ${updateError.message}`,
      });
    } else {
      console.log(`   ✅ Database updated\n`);
      results.push({
        teamId: team.id,
        teamName: team.name || `Team ${team.id}`,
        oldUrl: team.image,
        newPublicId: cloudinaryResult.publicId,
        newUrl: cloudinaryResult.url,
        success: true,
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY - TEAM IMAGES");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${supabaseTeams.length}`);
  console.log(`❌ Failed: ${failed}/${supabaseTeams.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed migrations:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.teamName} (ID: ${r.teamId}): ${r.error}`);
      });
  }

  // Save results
  fs.writeFileSync(
    "migration-results-teams.json",
    JSON.stringify(results, null, 2)
  );
  console.log("\n📄 Detailed results saved to: migration-results-teams.json");

  if (successful === supabaseTeams.length) {
    console.log("\n✨ All team images migrated successfully!");
    console.log("✅ Ready to proceed to step 4 (migrate project images)");
  } else {
    console.log(
      "\n⚠️  Some migrations failed. Review the errors before proceeding."
    );
  }
}

async function main() {
  try {
    await migrateTeamImages();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
