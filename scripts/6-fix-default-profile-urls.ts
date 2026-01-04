// Step 6: Fix default profile image URLs to use correct resource type
// Run with: npx tsx scripts/6-fix-default-profile-urls.ts

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

// The incorrect URL pattern
const incorrectUrl = `https://res.cloudinary.com/${cloudName}/image/upload/profiles/default-user-profile`;

// The correct URL (raw resource type for SVG with version)
const correctUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/profiles/default-user-profile.svg`;

async function fixDefaultProfileUrls() {
  console.log("🔧 Fixing default profile image URLs...\n");
  console.log(`Incorrect URL: ${incorrectUrl}`);
  console.log(`Correct URL:   ${correctUrl}\n`);

  // Find all profiles with the incorrect URL
  const { data: profiles, error: fetchError } = await supabase
    .from("profiles")
    .select("id, avatarImage")
    .eq("avatarImage", incorrectUrl);

  if (fetchError) {
    console.error("❌ Error fetching profiles:", fetchError);
    process.exit(1);
  }

  console.log(`Found ${profiles?.length || 0} profiles to fix\n`);

  if (!profiles || profiles.length === 0) {
    console.log("✨ No profiles need fixing!");
    return;
  }

  // Update all profiles
  const { error: updateError, count } = await supabase
    .from("profiles")
    .update({ avatarImage: correctUrl })
    .eq("avatarImage", incorrectUrl);

  if (updateError) {
    console.error("❌ Error updating profiles:", updateError);
    process.exit(1);
  }

  console.log(`✅ Updated ${count} profiles successfully!`);

  // Save results
  const results = {
    profilesFixed: count,
    oldUrl: incorrectUrl,
    newUrl: correctUrl,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "fix-default-profile-urls-results.json",
    JSON.stringify(results, null, 2)
  );
  console.log("\n📄 Results saved to: fix-default-profile-urls-results.json");
}

async function main() {
  try {
    await fixDefaultProfileUrls();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
