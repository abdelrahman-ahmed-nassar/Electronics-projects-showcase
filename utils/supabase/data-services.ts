import { createServiceClient } from "@/utils/supabase/server-service";
import {
  UserInterface,
  TeamInterface,
  ProjectInterface,
  ProjectDisplayInterface,
  StudentDisplayInterface,
} from "@/app/Types";
import { Database } from "@/utils/supabase/types";

// Define types for database row shapes
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

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

  // Get projects related to the student's team
  let projects: ProjectInterface[] = [];
  if (data.team) {
    try {
      projects = await getProjectsByTeam(data.team);
    } catch (error) {
      console.error(`Error fetching team projects: ${error}`);
      // Continue with empty projects if there's an error
    }
  }

  // Transform data to match UserInterface
  return {
    ...data,
    projects: projects, // Include the projects from the student's team
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

  return data || [];
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
          period: project.period || null,
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
      period: project.period || null,
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
 * Fetches all featured projects from the database
 */
export async function getFeaturedProjects(): Promise<
  ProjectDisplayInterface[]
> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("isFeatured", true);

    if (error) {
      throw new Error(`Error fetching featured projects: ${error.message}`);
    }

    // Use existing function to transform to display format
    const transformedProjects = await Promise.all(
      (data || []).map(async (project) => {
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
          period: project.period || null,
          image:
            project.image ||
            "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//default-project-image.png",
          tags: project.tags || [],
          dateCreated: project.created_at,
          link: project.link || null,
          team: teamInfo,
        };
      })
    );

    return transformedProjects;
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

/**
 * Fetches all featured teams with member information
 */
export async function getFeaturedTeams(): Promise<{
  teams: TeamInterface[];
  members: Record<number, UserInterface[]>;
  projectCounts: Record<number, number>;
}> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("isFeatured", true);

    if (error) {
      throw new Error(`Error fetching featured teams: ${error.message}`);
    }

    // Transform data to match TeamInterface
    const teams = data || [];

    // Get members and project counts for each team
    const members: Record<number, UserInterface[]> = {};
    const projectCounts: Record<number, number> = {};

    await Promise.all(
      teams.map(async (team) => {
        try {
          // Get team members
          const teamMembers = await getProfilesByTeam(team.id);
          members[team.id] = teamMembers;

          // Get project count
          const projects = await getProjectsByTeam(team.id);
          projectCounts[team.id] = projects.length;
        } catch (error) {
          console.error(`Error fetching data for team ${team.id}:`, error);
          members[team.id] = [];
          projectCounts[team.id] = 0;
        }
      })
    );

    return { teams, members, projectCounts };
  } catch (error) {
    console.error("Error fetching featured teams:", error);
    return { teams: [], members: {}, projectCounts: {} };
  }
}

/**
 * STUDENT OPERATIONS
 */

/**
 * Fetches all student profiles with a specialized format for the students page
 */
export async function getStudentsForDisplay(): Promise<
  StudentDisplayInterface[]
> {
  try {
    // Get all profiles directly from the database to preserve skills array format
    const supabase = await getSupabaseClient();
    const { data: profilesData, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      throw new Error(`Error fetching profiles: ${error.message}`);
    }

    // Get all projects to associate with students
    const allProjects = await getAllProjects();

    // Get all teams to get team names
    const allTeams = await getAllTeams();

    // Transform profiles into the student display format
    const students = await Promise.all(
      (profilesData || []).map(async (profile: ProfileRow) => {
        // Find team info
        const teamInfo = profile.team
          ? allTeams.find((team) => team.id === profile.team)
          : null;

        // Find projects associated with the student's team
        const studentProjects = profile.team
          ? allProjects.filter((project) => project.teamId === profile.team)
          : [];

        // Transform to format expected by the student page
        return {
          id: profile.id,
          name: profile.name || "Unknown Student",
          level: profile.isGraduated ? "Graduate" : "Undergraduate",
          specialization: profile.specialization || "General Electronics",
          team: teamInfo?.name || "Independent",
          role: profile.role || "Team Member",
          bio: profile.about || "No bio available",
          skills: profile.skills || "",
          projects: studentProjects.map((project) => ({
            id: project.id,
            title: project.title || "Untitled Project",
            role: profile.role || "Contributor",
            description: project.description || "No description available",
          })),
          image:
            profile.avatarImage || "/images/default-user-profile-image.svg",
        };
      })
    );

    return students;
  } catch (error) {
    console.error("Error fetching students for display:", error);
    return [];
  }
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
