import { createServiceClient } from "@/utils/supabase/server-service";
import { UserInterface, TeamInterface, ProjectInterface } from "@/app/Types";

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

  return data || [];
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

  return data;
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

  return data || [];
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

  return data;
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
