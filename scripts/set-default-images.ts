// Set default images for null fields
// Run with: tsx scripts/set-default-images.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

const defaultUrls = {
  profile: `https://res.cloudinary.com/${cloudName}/raw/upload/profiles/default-user-profile.svg`,
  team: `https://res.cloudinary.com/${cloudName}/image/upload/teams/default-team-image`,
  project: `https://res.cloudinary.com/${cloudName}/image/upload/projects/default-project-image`,
};

async function setDefaultProfileImages() {
  console.log("🔧 Setting default profile images for null fields...\n");

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatarImage: defaultUrls.profile })
    .is("avatarImage", null)
    .select();

  if (error) {
    console.error("❌ Error updating profiles:", error);
    return 0;
  }

  console.log(`✅ Set default image for ${data?.length || 0} profiles`);
  return data?.length || 0;
}

async function setDefaultTeamImages() {
  console.log("\n🔧 Setting default team images for null fields...\n");

  const { data, error } = await supabase
    .from("teams")
    .update({ image: defaultUrls.team })
    .is("image", null)
    .select();

  if (error) {
    console.error("❌ Error updating teams:", error);
    return 0;
  }

  console.log(`✅ Set default image for ${data?.length || 0} teams`);
  return data?.length || 0;
}

async function setDefaultProjectImages() {
  console.log("\n🔧 Setting default project images for null fields...\n");

  const { data, error } = await supabase
    .from("projects")
    .update({ image: defaultUrls.project })
    .is("image", null)
    .select();

  if (error) {
    console.error("❌ Error updating projects:", error);
    return 0;
  }

  console.log(`✅ Set default image for ${data?.length || 0} projects`);
  return data?.length || 0;
}

async function main() {
  console.log("🚀 Setting default Cloudinary images for null fields...");
  console.log("=".repeat(60));

  try {
    const profileCount = await setDefaultProfileImages();
    const teamCount = await setDefaultTeamImages();
    const projectCount = await setDefaultProjectImages();

    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Profiles: ${profileCount} updated`);
    console.log(`✅ Teams: ${teamCount} updated`);
    console.log(`✅ Projects: ${projectCount} updated`);
    console.log(
      `📝 Total: ${profileCount + teamCount + projectCount} records updated`
    );
    console.log("\n✨ All null fields now have default images!");
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main();
