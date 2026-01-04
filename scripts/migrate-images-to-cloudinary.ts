// Migration script to move images from Supabase to Cloudinary
// Run with: tsx scripts/migrate-images-to-cloudinary.ts

import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "../utils/cloudinary/config";

// Initialize Supabase client
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
  table: string;
  id: string | number;
  oldUrl: string;
  newPublicId: string;
  success: boolean;
  error?: string;
}

const results: MigrationResult[] = [];

async function uploadImageToCloudinary(
  imageUrl: string,
  folder: "projects" | "profiles" | "teams"
): Promise<{ publicId: string; url: string } | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: "image",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error(`Failed to upload ${imageUrl} to Cloudinary:`, error);
    return null;
  }
}

function isSupabaseImageUrl(url: string | null): boolean {
  if (!url) return false;
  return (
    url.includes("supabase.co/storage/v1/object/public") &&
    !url.includes("default-")
  );
}

async function migrateProfileImages() {
  console.log("\n📸 Migrating profile images...");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, avatarImage")
    .not("avatarImage", "is", null);

  if (error) {
    console.error("Error fetching profiles:", error);
    return;
  }

  for (const profile of profiles || []) {
    if (!isSupabaseImageUrl(profile.avatarImage)) {
      console.log(`⏭️  Skipping profile ${profile.id} (no Supabase image)`);
      continue;
    }

    console.log(`🔄 Migrating profile ${profile.id}...`);

    const result = await uploadImageToCloudinary(
      profile.avatarImage,
      "profiles"
    );

    if (result) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatarImage: result.publicId })
        .eq("id", profile.id);

      if (updateError) {
        console.error(
          `❌ Failed to update profile ${profile.id}:`,
          updateError
        );
        results.push({
          table: "profiles",
          id: profile.id,
          oldUrl: profile.avatarImage,
          newPublicId: result.publicId,
          success: false,
          error: updateError.message,
        });
      } else {
        console.log(`✅ Migrated profile ${profile.id}`);
        results.push({
          table: "profiles",
          id: profile.id,
          oldUrl: profile.avatarImage,
          newPublicId: result.publicId,
          success: true,
        });
      }
    } else {
      results.push({
        table: "profiles",
        id: profile.id,
        oldUrl: profile.avatarImage,
        newPublicId: "",
        success: false,
        error: "Failed to upload to Cloudinary",
      });
    }
  }
}

async function migrateTeamImages() {
  console.log("\n🏆 Migrating team images...");

  const { data: teams, error } = await supabase
    .from("teams")
    .select("id, image")
    .not("image", "is", null);

  if (error) {
    console.error("Error fetching teams:", error);
    return;
  }

  for (const team of teams || []) {
    if (!isSupabaseImageUrl(team.image)) {
      console.log(`⏭️  Skipping team ${team.id} (no Supabase image)`);
      continue;
    }

    console.log(`🔄 Migrating team ${team.id}...`);

    const result = await uploadImageToCloudinary(team.image, "teams");

    if (result) {
      const { error: updateError } = await supabase
        .from("teams")
        .update({ image: result.publicId })
        .eq("id", team.id);

      if (updateError) {
        console.error(`❌ Failed to update team ${team.id}:`, updateError);
        results.push({
          table: "teams",
          id: team.id,
          oldUrl: team.image,
          newPublicId: result.publicId,
          success: false,
          error: updateError.message,
        });
      } else {
        console.log(`✅ Migrated team ${team.id}`);
        results.push({
          table: "teams",
          id: team.id,
          oldUrl: team.image,
          newPublicId: result.publicId,
          success: true,
        });
      }
    } else {
      results.push({
        table: "teams",
        id: team.id,
        oldUrl: team.image,
        newPublicId: "",
        success: false,
        error: "Failed to upload to Cloudinary",
      });
    }
  }
}

async function migrateProjectImages() {
  console.log("\n🚀 Migrating project images...");

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, image")
    .not("image", "is", null);

  if (error) {
    console.error("Error fetching projects:", error);
    return;
  }

  for (const project of projects || []) {
    if (!isSupabaseImageUrl(project.image)) {
      console.log(`⏭️  Skipping project ${project.id} (no Supabase image)`);
      continue;
    }

    console.log(`🔄 Migrating project ${project.id}...`);

    const result = await uploadImageToCloudinary(project.image, "projects");

    if (result) {
      const { error: updateError } = await supabase
        .from("projects")
        .update({ image: result.publicId })
        .eq("id", project.id);

      if (updateError) {
        console.error(
          `❌ Failed to update project ${project.id}:`,
          updateError
        );
        results.push({
          table: "projects",
          id: project.id,
          oldUrl: project.image,
          newPublicId: result.publicId,
          success: false,
          error: updateError.message,
        });
      } else {
        console.log(`✅ Migrated project ${project.id}`);
        results.push({
          table: "projects",
          id: project.id,
          oldUrl: project.image,
          newPublicId: result.publicId,
          success: true,
        });
      }
    } else {
      results.push({
        table: "projects",
        id: project.id,
        oldUrl: project.image,
        newPublicId: "",
        success: false,
        error: "Failed to upload to Cloudinary",
      });
    }
  }
}

async function uploadDefaultImages() {
  console.log("\n🖼️  Uploading default images to Cloudinary...");

  const defaultImages = [
    {
      url: "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/profiles-images/default-user-profile.svg",
      folder: "profiles" as const,
      publicId: "profiles/default-user-profile",
    },
    {
      url: "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/teams-images/default-team-image.png",
      folder: "teams" as const,
      publicId: "teams/default-team-image",
    },
    {
      url: "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/projects-images/default-project-image.png",
      folder: "projects" as const,
      publicId: "projects/default-project-image",
    },
  ];

  for (const img of defaultImages) {
    try {
      console.log(`🔄 Uploading ${img.publicId}...`);
      await cloudinary.uploader.upload(img.url, {
        public_id: img.publicId,
        resource_type: "image",
        overwrite: true,
      });
      console.log(`✅ Uploaded ${img.publicId}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${img.publicId}:`, error);
    }
  }
}

async function printSummary() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`\n✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${results.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed migrations:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.table} ID ${r.id}: ${r.error || "Unknown error"}`);
      });
  }

  // Write results to file
  const fs = require("fs");
  fs.writeFileSync("migration-results.json", JSON.stringify(results, null, 2));
  console.log("\n📄 Full results written to migration-results.json");
}

async function main() {
  console.log("🚀 Starting Supabase to Cloudinary migration...");
  console.log("=".repeat(60));

  try {
    // Upload default images first
    await uploadDefaultImages();

    // Migrate all image types
    await migrateProfileImages();
    await migrateTeamImages();
    await migrateProjectImages();

    // Print summary
    await printSummary();

    console.log("\n✨ Migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
