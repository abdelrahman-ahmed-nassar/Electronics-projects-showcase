// Step 4: Migrate project images from Supabase to Cloudinary
// Run with: tsx scripts/4-migrate-project-images.ts

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
  projectId: number;
  projectTitle: string;
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
      folder: "projects",
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

async function migrateProjectImages() {
  console.log("🚀 Migrating project images from Supabase to Cloudinary...\n");

  // Fetch all projects with images
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, image, title")
    .not("image", "is", null);

  if (error) {
    console.error("❌ Error fetching projects:", error);
    process.exit(1);
  }

  console.log(`Found ${projects?.length || 0} projects with images\n`);

  const results: MigrationResult[] = [];
  const supabaseProjects =
    projects?.filter((p) => isSupabaseImageUrl(p.image)) || [];

  console.log(`${supabaseProjects.length} projects need migration\n`);

  if (supabaseProjects.length === 0) {
    console.log("✨ No projects to migrate!");
    return;
  }

  // Migrate each project
  for (let i = 0; i < supabaseProjects.length; i++) {
    const project = supabaseProjects[i];
    console.log(
      `[${i + 1}/${supabaseProjects.length}] Migrating: ${
        project.title || `Project ${project.id}`
      }`
    );
    console.log(`   Current URL: ${project.image}`);

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(project.image);

    if (!cloudinaryResult) {
      console.log(`   ❌ Failed to upload\n`);
      results.push({
        projectId: project.id,
        projectTitle: project.title || `Project ${project.id}`,
        oldUrl: project.image,
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
      .from("projects")
      .update({ image: cloudinaryResult.url })
      .eq("id", project.id);

    if (updateError) {
      console.log(`   ❌ Failed to update database: ${updateError.message}\n`);
      results.push({
        projectId: project.id,
        projectTitle: project.title || `Project ${project.id}`,
        oldUrl: project.image,
        newPublicId: cloudinaryResult.publicId,
        newUrl: cloudinaryResult.url,
        success: false,
        error: `Database update failed: ${updateError.message}`,
      });
    } else {
      console.log(`   ✅ Database updated\n`);
      results.push({
        projectId: project.id,
        projectTitle: project.title || `Project ${project.id}`,
        oldUrl: project.image,
        newPublicId: cloudinaryResult.publicId,
        newUrl: cloudinaryResult.url,
        success: true,
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY - PROJECT IMAGES");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${supabaseProjects.length}`);
  console.log(`❌ Failed: ${failed}/${supabaseProjects.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed migrations:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.projectTitle} (ID: ${r.projectId}): ${r.error}`);
      });
  }

  // Save results
  fs.writeFileSync(
    "migration-results-projects.json",
    JSON.stringify(results, null, 2)
  );
  console.log(
    "\n📄 Detailed results saved to: migration-results-projects.json"
  );

  if (successful === supabaseProjects.length) {
    console.log("\n✨ All project images migrated successfully!");
    console.log(
      "🎉 MIGRATION COMPLETE! All images have been moved to Cloudinary."
    );
  } else {
    console.log("\n⚠️  Some migrations failed. Review the errors above.");
  }
}

async function main() {
  try {
    await migrateProjectImages();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
