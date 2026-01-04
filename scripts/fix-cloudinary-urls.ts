// Fix script: Convert Cloudinary public IDs back to full URLs
// Run with: tsx scripts/fix-cloudinary-urls.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

function isCloudinaryPublicId(value: string | null): boolean {
  if (!value) return false;
  // Check if it's a public ID (not a full URL)
  return (
    (value.startsWith("profiles/") ||
      value.startsWith("teams/") ||
      value.startsWith("projects/")) &&
    !value.startsWith("http")
  );
}

function publicIdToUrl(publicId: string): string {
  // Determine resource type based on file extension or folder
  if (publicId.includes("default-user-profile")) {
    // SVG file stored as raw
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}.svg`;
  }
  // Regular images
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

async function fixProfileImages() {
  console.log("🔧 Fixing profile images...\n");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, avatarImage, name")
    .not("avatarImage", "is", null);

  if (error) {
    console.error("❌ Error fetching profiles:", error);
    return;
  }

  let fixed = 0;
  let skipped = 0;

  for (const profile of profiles || []) {
    if (isCloudinaryPublicId(profile.avatarImage)) {
      const fullUrl = publicIdToUrl(profile.avatarImage);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatarImage: fullUrl })
        .eq("id", profile.id);

      if (updateError) {
        console.log(
          `❌ Failed to update ${profile.name}: ${updateError.message}`
        );
      } else {
        console.log(`✅ Fixed ${profile.name || profile.id}`);
        console.log(`   ${profile.avatarImage} → ${fullUrl}`);
        fixed++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Profiles: ${fixed} fixed, ${skipped} skipped`);
}

async function fixTeamImages() {
  console.log("\n🔧 Fixing team images...\n");

  const { data: teams, error } = await supabase
    .from("teams")
    .select("id, image, name")
    .not("image", "is", null);

  if (error) {
    console.error("❌ Error fetching teams:", error);
    return;
  }

  let fixed = 0;
  let skipped = 0;

  for (const team of teams || []) {
    if (isCloudinaryPublicId(team.image)) {
      const fullUrl = publicIdToUrl(team.image);

      const { error: updateError } = await supabase
        .from("teams")
        .update({ image: fullUrl })
        .eq("id", team.id);

      if (updateError) {
        console.log(`❌ Failed to update ${team.name}: ${updateError.message}`);
      } else {
        console.log(`✅ Fixed ${team.name || `Team ${team.id}`}`);
        console.log(`   ${team.image} → ${fullUrl}`);
        fixed++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Teams: ${fixed} fixed, ${skipped} skipped`);
}

async function fixProjectImages() {
  console.log("\n🔧 Fixing project images...\n");

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, image, title")
    .not("image", "is", null);

  if (error) {
    console.error("❌ Error fetching projects:", error);
    return;
  }

  let fixed = 0;
  let skipped = 0;

  for (const project of projects || []) {
    if (isCloudinaryPublicId(project.image)) {
      const fullUrl = publicIdToUrl(project.image);

      const { error: updateError } = await supabase
        .from("projects")
        .update({ image: fullUrl })
        .eq("id", project.id);

      if (updateError) {
        console.log(
          `❌ Failed to update ${project.title}: ${updateError.message}`
        );
      } else {
        console.log(`✅ Fixed ${project.title || `Project ${project.id}`}`);
        console.log(`   ${project.image} → ${fullUrl}`);
        fixed++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Projects: ${fixed} fixed, ${skipped} skipped`);
}

async function fixDefaultImages() {
  console.log("\n🔧 Fixing default image URLs...\n");

  const defaultMappings = [
    {
      table: "profiles",
      column: "avatarImage",
      oldUrl:
        "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/profiles-images/default-user-profile.svg",
      newUrl: `https://res.cloudinary.com/${cloudName}/raw/upload/profiles/default-user-profile.svg`,
    },
    {
      table: "teams",
      column: "image",
      oldUrl:
        "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/teams-images/default-team-image.png",
      newUrl: `https://res.cloudinary.com/${cloudName}/image/upload/teams/default-team-image`,
    },
    {
      table: "projects",
      column: "image",
      oldUrl:
        "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/projects-images/default-project-image.png",
      newUrl: `https://res.cloudinary.com/${cloudName}/image/upload/projects/default-project-image`,
    },
  ];

  for (const mapping of defaultMappings) {
    const { data, error } = await supabase
      .from(mapping.table)
      .update({ [mapping.column]: mapping.newUrl })
      .eq(mapping.column, mapping.oldUrl)
      .select();

    if (error) {
      console.log(`❌ Failed to update ${mapping.table}: ${error.message}`);
    } else {
      console.log(
        `✅ Updated ${data?.length || 0} ${mapping.table} with default image`
      );
      console.log(`   ${mapping.oldUrl.substring(0, 70)}...`);
      console.log(`   → ${mapping.newUrl}`);
    }
  }
}

async function main() {
  console.log("🚀 Fixing Cloudinary URLs in database...");
  console.log("=".repeat(60));

  try {
    await fixDefaultImages();
    await fixProfileImages();
    await fixTeamImages();
    await fixProjectImages();

    console.log("\n" + "=".repeat(60));
    console.log("✨ All URLs fixed successfully!");
    console.log("🎉 Your images should now display correctly!");
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
