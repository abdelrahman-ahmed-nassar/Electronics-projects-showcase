import { createServiceClient } from "@/utils/supabase/server-service";
import {
  UserInterface,
  TeamInterface,
  ProjectInterface,
  ProjectDisplayInterface,
} from "@/app/Types";
import { Database } from "@/utils/supabase/types";

// Define types for database row shapes
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type TeamRow = Database["public"]["Tables"]["teams"]["Row"];

/**
 * Gets the Supabase client for server-side operations
 */
async function getSupabaseClient() {
  return await createServiceClient();
}

/**
 * USER/PROFILE OPERATIONS
 */

/**
 * Fetches all profiles from the database
 */
export async function getAllProfiles(): Promise<UserInterface[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    throw new Error(`Error fetching profiles: ${error.message}`);
  }

  // Transform data to match UserInterface
  return (data || []).map((profile: ProfileRow) => ({
    ...profile,
    // In the types.ts, skills is string[] but in Types.ts it's string | null
    skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : null,
    projects: null, // Initialize projects as null
  }));
}

/**
 * Fetches a specific profile by ID
 */
export async function getProfileById(
  id: string
): Promise<UserInterface | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error fetching profile: ${error.message}`);
  }

  if (!data) return null;

  // Transform data to match UserInterface
  return {
    ...data,
    skills: Array.isArray(data.skills) ? data.skills.join(", ") : null,
    projects: null, // Initialize projects as null
  };
}

/**
 * Fetches profiles by team ID
 */
export async function getProfilesByTeam(
  teamId: number
): Promise<UserInterface[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("team", teamId);

  if (error) {
    throw new Error(`Error fetching profiles by team: ${error.message}`);
  }

  // Transform data to match UserInterface
  return (data || []).map((profile: ProfileRow) => ({
    ...profile,
    skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : null,
    projects: null, // Initialize projects as null
  }));
}

/**
 * TEAM OPERATIONS
 */

/**
 * Fetches all teams from the database
 */
export async function getAllTeams(): Promise<TeamInterface[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from("teams").select("*");

  if (error) {
    throw new Error(`Error fetching teams: ${error.message}`);
  }

  // Transform data to match TeamInterface
  return (data || []).map((team: TeamRow) => ({
    ...team,
    // In the types.ts, achievements is string[] but in Types.ts it's string | null
    achievements: Array.isArray(team.achievements)
      ? team.achievements.join(", ")
      : null,
  }));
}

/**
 * Fetches a team by ID
 */
export async function getTeamById(id: number): Promise<TeamInterface | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error fetching team: ${error.message}`);
  }

  if (!data) return null;

  // Transform data to match TeamInterface
  return {
    ...data,
    achievements: Array.isArray(data.achievements)
      ? data.achievements.join(", ")
      : null,
  };
}

/**
 * Fetches team with members
 */
export async function getTeamWithMembers(
  teamId: number
): Promise<{ team: TeamInterface | null; members: UserInterface[] }> {
  const team = await getTeamById(teamId);
  const members = await getProfilesByTeam(teamId);

  return { team, members };
}

/**
 * PROJECT OPERATIONS
 */

/**
 * Fetches all projects from the database
 */
export async function getAllProjects(): Promise<ProjectInterface[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    throw new Error(`Error fetching projects: ${error.message}`);
  }

  return data || [];
}

/**
 * Transform projects for client display
 * This returns projects in the format expected by the client UI
 */
export async function getProjectsForDisplay(): Promise<
  ProjectDisplayInterface[]
> {
  try {
    const projects = await getAllProjects();
    const transformedProjects = await Promise.all(
      projects.map(async (project) => {
        // Get team information if teamId exists
        let teamInfo: {
          name: string;
          id: number;
          members: {
            name: string;
            role: string;
            image: string | null;
            id: string;
          }[];
        } = {
          name: "No team assigned",
          id: project.teamId || 0,
          members: [],
        };

        if (project.teamId) {
          try {
            const team = await getTeamById(project.teamId);
            const members = await getProfilesByTeam(project.teamId);

            if (team) {
              teamInfo = {
                name: team.name || "Team name not available",
                id: team.id,
                members: members.map((member) => ({
                  name: member.name || "Unknown",
                  role: member.role || member.specialization || "Team Member",
                  image:
                    member.avatarImage ||
                    "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/profiles-images//default-user-profile.svg",
                  id: member.id || "Unknown ID",
                })),
              };
            }
          } catch (error) {
            console.error(
              `Error fetching team data for project ${project.id}:`,
              error
            );
          }
        }

        return {
          id: project.id,
          title: project.title || "Untitled Project",
          description: project.description || "No description available",
          image:
            project.image ||
            "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//default-team-image.png",
          tags: project.tags || [],
          dateCreated: project.created_at,
          link: project.link || null,
          team: teamInfo,
        };
      })
    );

    return transformedProjects;
  } catch (error) {
    console.error("Error transforming projects:", error);
    return [];
  }
}

/**
 * Get a single project formatted for display
 */
export async function getProjectDisplayById(
  id: number
): Promise<ProjectDisplayInterface | null> {
  try {
    const project = await getProjectById(id);

    if (!project) return null;

    // Get team information if teamId exists
    let teamInfo: {
      name: string;
      id: number;
      members: {
        name: string;
        role: string;
        image: string | null;
        id: string;
      }[];
    } = {
      name: "No team assigned",
      id: project.teamId || 0,
      members: [],
    };

    if (project.teamId) {
      try {
        const team = await getTeamById(project.teamId);
        const members = await getProfilesByTeam(project.teamId);

        if (team) {
          teamInfo = {
            name: team.name || "Team name not available",
            id: team.id,
            members: members.map((member) => ({
              name: member.name || "Unknown",
              role: member.role || member.specialization || "Team Member",
              image:
                member.avatarImage ||
                "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/profiles-images//default-user-profile.svg",
              id: member.id || "Unknown ID",
            })),
          };
        }
      } catch (error) {
        console.error(
          `Error fetching team data for project ${project.id}:`,
          error
        );
      }
    }

    return {
      id: project.id,
      title: project.title || "Untitled Project",
      description: project.description || "No description available",
      image:
        project.image ||
        "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//default-project-image.png",
      tags: project.tags || [],
      dateCreated: project.created_at,
      link: project.link || null,
      team: teamInfo,
    };
  } catch (error) {
    console.error(`Error getting project display for id ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a project by ID
 */
export async function getProjectById(
  id: number
): Promise<ProjectInterface | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error fetching project: ${error.message}`);
  }

  return data;
}

/**
 * Fetches projects by team ID
 */
export async function getProjectsByTeam(
  teamId: number
): Promise<ProjectInterface[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("teamId", teamId);

  if (error) {
    throw new Error(`Error fetching projects by team: ${error.message}`);
  }

  return data || [];
}

/**
 * Uploads a new project to the database
 */
export async function uploadProject(
  project: Omit<ProjectInterface, "id" | "created_at">
): Promise<ProjectInterface> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .insert([project]) // Insert as an array
    .select() // Select the inserted row
    .single(); // Expect a single row back

  if (error) {
    console.error("Supabase upload error:", error); // Log detailed error
    throw new Error(`Error uploading project: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to upload project: No data returned.");
  }

  return data;
}

/**
 * RELATED DATA OPERATIONS
 */

/**
 * Gets complete team data including projects and members
 */
export async function getCompleteTeamData(teamId: number): Promise<{
  team: TeamInterface | null;
  members: UserInterface[];
  projects: ProjectInterface[];
}> {
  const team = await getTeamById(teamId);
  const members = await getProfilesByTeam(teamId);
  const projects = await getProjectsByTeam(teamId);

  return { team, members, projects };
}
