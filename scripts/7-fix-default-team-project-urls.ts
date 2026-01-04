// Step 7: Fix default team and project image URLs to include version and extension
// Run with: npx tsx scripts/7-fix-default-team-project-urls.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { getCloudinaryConfig } from "../utils/cloudinary/config";
import { v2 as cloudinary } from "cloudinary";
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

const cloudName = cloudinaryConfig.cloudName;

async function getCloudinaryUrlWithVersion(
  publicId: string
): Promise<string | null> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error fetching Cloudinary resource for ${publicId}:`, error);
    return null;
  }
}

async function fixDefaultUrls() {
  console.log("🔧 Fixing default team and project image URLs...\n");

  const results: any[] = [];

  // Fix Teams
  console.log("👥 Fixing teams...");
  const incorrectTeamUrl = `https://res.cloudinary.com/${cloudName}/image/upload/teams/default-team-image`;

  const correctTeamUrl = await getCloudinaryUrlWithVersion(
    "teams/default-team-image"
  );

  if (!correctTeamUrl) {
    console.error("❌ Could not fetch correct team image URL from Cloudinary");
  } else {
    console.log(`   Incorrect: ${incorrectTeamUrl}`);
    console.log(`   Correct:   ${correctTeamUrl}`);

    const { data: teams, error: fetchTeamsError } = await supabase
      .from("teams")
      .select("id, image")
      .eq("image", incorrectTeamUrl);

    if (fetchTeamsError) {
      console.error("❌ Error fetching teams:", fetchTeamsError);
    } else {
      console.log(`   Found ${teams?.length || 0} teams to fix`);

      if (teams && teams.length > 0) {
        const { error: updateError } = await supabase
          .from("teams")
          .update({ image: correctTeamUrl })
          .eq("image", incorrectTeamUrl);

        if (updateError) {
          console.error("❌ Error updating teams:", updateError);
          results.push({
            type: "teams",
            success: false,
            error: updateError.message,
          });
        } else {
          console.log(`   ✅ Updated ${teams.length} teams\n`);
          results.push({
            type: "teams",
            count: teams.length,
            oldUrl: incorrectTeamUrl,
            newUrl: correctTeamUrl,
            success: true,
          });
        }
      } else {
        console.log(`   ✅ No teams need fixing\n`);
      }
    }
  }

  // Fix Projects
  console.log("📦 Fixing projects...");
  const incorrectProjectUrl = `https://res.cloudinary.com/${cloudName}/image/upload/projects/default-project-image`;

  const correctProjectUrl = await getCloudinaryUrlWithVersion(
    "projects/default-project-image"
  );

  if (!correctProjectUrl) {
    console.error(
      "❌ Could not fetch correct project image URL from Cloudinary"
    );
  } else {
    console.log(`   Incorrect: ${incorrectProjectUrl}`);
    console.log(`   Correct:   ${correctProjectUrl}`);

    const { data: projects, error: fetchProjectsError } = await supabase
      .from("projects")
      .select("id, image")
      .eq("image", incorrectProjectUrl);

    if (fetchProjectsError) {
      console.error("❌ Error fetching projects:", fetchProjectsError);
    } else {
      console.log(`   Found ${projects?.length || 0} projects to fix`);

      if (projects && projects.length > 0) {
        const { error: updateError } = await supabase
          .from("projects")
          .update({ image: correctProjectUrl })
          .eq("image", incorrectProjectUrl);

        if (updateError) {
          console.error("❌ Error updating projects:", updateError);
          results.push({
            type: "projects",
            success: false,
            error: updateError.message,
          });
        } else {
          console.log(`   ✅ Updated ${projects.length} projects\n`);
          results.push({
            type: "projects",
            count: projects.length,
            oldUrl: incorrectProjectUrl,
            newUrl: correctProjectUrl,
            success: true,
          });
        }
      } else {
        console.log(`   ✅ No projects need fixing\n`);
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 FIX SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  // Save results
  fs.writeFileSync(
    "fix-default-team-project-urls-results.json",
    JSON.stringify(results, null, 2)
  );
  console.log(
    "\n📄 Results saved to: fix-default-team-project-urls-results.json"
  );

  if (failed === 0) {
    console.log("\n✨ All default image URLs fixed successfully!");
  }
}

async function main() {
  try {
    await fixDefaultUrls();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
