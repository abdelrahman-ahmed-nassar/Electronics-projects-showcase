import "dotenv/config";
import { getAllProfiles, getStudentsForDisplay } from "@/utils/db/data-services";

async function main() {
  console.log("Fetching profiles from unified user table...");
  const profiles = await getAllProfiles();
  console.log(`Fetched ${profiles.length} profiles.`);
  if (profiles.length > 0) {
    console.log("Sample profile:", {
      id: profiles[0].id,
      name: profiles[0].name,
      phone: profiles[0].phone,
      team: profiles[0].team,
      avatarImage: profiles[0].avatarImage,
    });
  }

  console.log("Fetching students for display...");
  const students = await getStudentsForDisplay();
  console.log(`Fetched ${students.length} students for display.`);
  if (students.length > 0) {
    console.log("Sample student display:", {
      id: students[0].id,
      name: students[0].name,
      team: students[0].team,
      role: students[0].role,
      specialization: students[0].specialization,
    });
  }

  console.log("Testing Drizzle relational query API (db.query)...");
  const { db } = await import("@/db");
  const userWithRelations = await db.query.user.findFirst({
    with: {
      team: true,
      accounts: true,
      sessions: true,
    },
  });
  console.log("User fetched with team & accounts via db.query:", {
    userName: userWithRelations?.name,
    teamName: userWithRelations?.team?.name,
    accountsCount: userWithRelations?.accounts?.length,
    sessionsCount: userWithRelations?.sessions?.length,
  });

  console.log("All queries verified successfully!");
}

main().catch(console.error);
