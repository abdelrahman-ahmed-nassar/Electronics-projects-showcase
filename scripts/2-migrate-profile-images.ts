// Step 2: Migrate profile images from Supabase to Cloudinary
// Run with: tsx scripts/2-migrate-profile-images.ts

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
  profileId: string;
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
      folder: "profiles",
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

async function migrateProfileImages() {
  console.log("📸 Migrating profile images from Supabase to Cloudinary...\n");

  // Fetch all profiles with images
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, avatarImage, name")
    .not("avatarImage", "is", null);

  if (error) {
    console.error("❌ Error fetching profiles:", error);
    process.exit(1);
  }

  console.log(`Found ${profiles?.length || 0} profiles with images\n`);

  const results: MigrationResult[] = [];
  const supabaseProfiles =
    profiles?.filter((p) => isSupabaseImageUrl(p.avatarImage)) || [];

  console.log(`${supabaseProfiles.length} profiles need migration\n`);

  if (supabaseProfiles.length === 0) {
    console.log("✨ No profiles to migrate!");
    return;
  }

  // Migrate each profile
  for (let i = 0; i < supabaseProfiles.length; i++) {
    const profile = supabaseProfiles[i];
    console.log(
      `[${i + 1}/${supabaseProfiles.length}] Migrating: ${
        profile.name || profile.id
      }`
    );
    console.log(`   Current URL: ${profile.avatarImage}`);

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(profile.avatarImage);

    if (!cloudinaryResult) {
      console.log(`   ❌ Failed to upload\n`);
      results.push({
        profileId: profile.id,
        oldUrl: profile.avatarImage,
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
      .from("profiles")
      .update({ avatarImage: cloudinaryResult.publicId })
      .eq("id", profile.id);

    if (updateError) {
      console.log(`   ❌ Failed to update database: ${updateError.message}\n`);
      results.push({
        profileId: profile.id,
        oldUrl: profile.avatarImage,
        newPublicId: cloudinaryResult.publicId,
        newUrl: cloudinaryResult.url,
        success: false,
        error: `Database update failed: ${updateError.message}`,
      });
    } else {
      console.log(`   ✅ Database updated\n`);
      results.push({
        profileId: profile.id,
        oldUrl: profile.avatarImage,
        newPublicId: cloudinaryResult.publicId,
        newUrl: cloudinaryResult.url,
        success: true,
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY - PROFILE IMAGES");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${supabaseProfiles.length}`);
  console.log(`❌ Failed: ${failed}/${supabaseProfiles.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed migrations:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - Profile ${r.profileId}: ${r.error}`);
      });
  }

  // Save results
  fs.writeFileSync(
    "migration-results-profiles.json",
    JSON.stringify(results, null, 2)
  );
  console.log(
    "\n📄 Detailed results saved to: migration-results-profiles.json"
  );

  if (successful === supabaseProfiles.length) {
    console.log("\n✨ All profile images migrated successfully!");
    console.log("✅ Ready to proceed to step 3 (migrate team images)");
  } else {
    console.log(
      "\n⚠️  Some migrations failed. Review the errors before proceeding."
    );
  }
}

async function main() {
  try {
    await migrateProfileImages();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
