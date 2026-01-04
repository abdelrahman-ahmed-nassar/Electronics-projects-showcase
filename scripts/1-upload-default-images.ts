// Step 1: Upload default images to Cloudinary
// Run with: tsx scripts/1-upload-default-images.ts

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "../utils/cloudinary/config";

// Initialize Cloudinary
const cloudinaryConfig = getCloudinaryConfig();
cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

const defaultImages = [
  {
    url: "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/profiles-images/default-user-profile.svg",
    publicId: "profiles/default-user-profile",
    name: "Default Profile Image",
    resourceType: "raw" as const, // SVG as raw file
  },
  {
    url: "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/teams-images/default-team-image.png",
    publicId: "teams/default-team-image",
    name: "Default Team Image",
    resourceType: "image" as const,
  },
  {
    url: "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/projects-images/default-project-image.png",
    publicId: "projects/default-project-image",
    name: "Default Project Image",
    resourceType: "image" as const,
  },
];

async function uploadDefaultImages() {
  console.log("🖼️  Uploading default images to Cloudinary...\n");

  const results = [];

  for (const img of defaultImages) {
    try {
      console.log(`🔄 Uploading ${img.name}...`);
      console.log(`   Source: ${img.url}`);
      console.log(`   Target: ${img.publicId}`);

      const result = await cloudinary.uploader.upload(img.url, {
        public_id: img.publicId,
        resource_type: img.resourceType,
        overwrite: true,
      });

      console.log(`✅ Success! URL: ${result.secure_url}\n`);
      results.push({
        name: img.name,
        publicId: img.publicId,
        url: result.secure_url,
        success: true,
      });
    } catch (error) {
      console.error(`❌ Failed to upload ${img.name}:`);
      console.error(
        `   Error: ${error instanceof Error ? error.message : error}\n`
      );
      results.push({
        name: img.name,
        publicId: img.publicId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 UPLOAD SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${defaultImages.length}`);
  console.log(`❌ Failed: ${failed}/${defaultImages.length}`);

  if (successful === defaultImages.length) {
    console.log("\n✨ All default images uploaded successfully!");
    console.log("✅ Ready to proceed to step 2 (migrate profile images)");
  } else {
    console.log("\n⚠️  Some uploads failed. Please check the errors above.");
    console.log("Fix the issues before proceeding to the next step.");
  }

  return results;
}

async function main() {
  try {
    await uploadDefaultImages();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
