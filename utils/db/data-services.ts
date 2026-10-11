import { and, count, eq, gte, isNotNull, lte, ne } from "drizzle-orm";
import { db } from "@/db";
import { profiles, projects, teams } from "@/db/schema";
import {
  UserInterface,
  TeamInterface,
  ProjectInterface,
  ProjectDisplayInterface,
  StudentDisplayInterface,
} from "@/app/Types";
import {
  CLOUDINARY_DEFAULTS,
  resolveImageUrl,
} from "@/utils/cloudinary/helpers";

type ProfileRow = typeof profiles.$inferSelect;
type ProjectRow = typeof projects.$inferSelect;
type TeamRow = typeof teams.$inferSelect;

const toTeam = (row: TeamRow): TeamInterface => ({
  ...row,
  image: resolveImageUrl(row.image),
  createdAt: row.createdAt.toISOString(),
});

const toProject = (row: ProjectRow): ProjectInterface => ({
  ...row,
  image: resolveImageUrl(row.image),
  created_at: row.created_at.toISOString(),
  isFeatured: row.isFeatured ?? false,
});

const toProfile = (row: ProfileRow): UserInterface => ({
  ...row,
  avatarImage: resolveImageUrl(row.avatarImage),
  projects: null,
});


/**
 * USER/PROFILE OPERATIONS
 */

export async function getAllProfiles(): Promise<UserInterface[]> {
  const rows = await db.select().from(profiles);
  return rows.map(toProfile);
}

export async function getProfileById(
  id: string
): Promise<UserInterface | null> {
  const [data] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  if (!data) return null;

  let teamProjects: ProjectInterface[] = [];
  if (data.team) {
    try {
      teamProjects = await getProjectsByTeam(data.team);
    } catch (error) {
      console.error(`Error fetching team projects: ${error}`);
    }
  }

  return { ...toProfile(data), projects: teamProjects };
}

export async function getProfilesByTeam(
  teamId: number
): Promise<UserInterface[]> {
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.team, teamId));
  return rows.map(toProfile);
}

/**
 * TEAM OPERATIONS
 */

export async function getAllTeams(): Promise<TeamInterface[]> {
  const rows = await db.select().from(teams);
  return rows.map(toTeam);
}

export async function getTeamById(id: number): Promise<TeamInterface | null> {
  const [data] = await db
    .select()
    .from(teams)
    .where(eq(teams.id, id))
    .limit(1);
  return data ? toTeam(data) : null;
}

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

export async function getAllProjects(): Promise<ProjectInterface[]> {
  const rows = await db.select().from(projects);
  return rows.map(toProject);
}

async function buildTeamInfo(teamId: number | null, projectId: number) {
  let teamInfo: ProjectDisplayInterface["team"] = {
    name: "No team assigned",
    id: teamId || 0,
    members: [],
  };

  if (!teamId) return teamInfo;

  try {
    const team = await getTeamById(teamId);
    const members = await getProfilesByTeam(teamId);

    if (team) {
      teamInfo = {
        name: team.name || "Team name not available",
        id: team.id,
        members: members.map((member) => ({
          name: member.name || "Unknown",
          role: member.role || member.specialization || "Team Member",
          image: resolveImageUrl(member.avatarImage) || CLOUDINARY_DEFAULTS.profile,
          id: member.id || "Unknown ID",
        })),
      };
    }
  } catch (error) {
    console.error(`Error fetching team data for project ${projectId}:`, error);
  }

  return teamInfo;
}

function toProjectDisplay(
  project: ProjectInterface,
  team: ProjectDisplayInterface["team"]
): ProjectDisplayInterface {
  return {
    id: project.id,
    title: project.title || "Untitled Project",
    description: project.description || "No description available",
    period: project.period || null,
    image: project.image || CLOUDINARY_DEFAULTS.project,
    tags: project.tags || [],
    dateCreated: project.created_at,
    link: project.link || null,
    team,
  };
}

/**
 * Transform projects for client display, optionally filtered by creation date range
 */
export async function getProjectsForDisplay(
  startDate?: string | null,
  endDate?: string | null
): Promise<ProjectDisplayInterface[]> {
  try {
    const conditions = [];

    if (startDate) {
      conditions.push(
        gte(
          projects.created_at,
          new Date(`${startDate}T00:00:00.000Z`)
        )
      );
    }
    if (endDate) {
      conditions.push(
        lte(projects.created_at, new Date(`${endDate}T23:59:59.999Z`))
      );
    }

    const rows = await db
      .select()
      .from(projects)
      .where(conditions.length ? and(...conditions) : undefined);

    return await Promise.all(
      rows.map(async (row) => {
        const project = toProject(row);
        return toProjectDisplay(
          project,
          await buildTeamInfo(project.teamId, project.id)
        );
      })
    );
  } catch (error) {
    console.error("Error transforming projects:", error);
    return [];
  }
}

export async function getProjectDisplayById(
  id: number
): Promise<ProjectDisplayInterface | null> {
  try {
    const project = await getProjectById(id);
    if (!project) return null;

    return toProjectDisplay(
      project,
      await buildTeamInfo(project.teamId, project.id)
    );
  } catch (error) {
    console.error(`Error getting project display for id ${id}:`, error);
    return null;
  }
}

export async function getProjectById(
  id: number
): Promise<ProjectInterface | null> {
  const [data] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return data ? toProject(data) : null;
}

export async function getProjectsByTeam(
  teamId: number
): Promise<ProjectInterface[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.teamId, teamId));
  return rows.map(toProject);
}

export async function uploadProject(
  project: Omit<ProjectInterface, "id" | "created_at">
): Promise<ProjectInterface> {
  const [data] = await db
    .insert(projects)
    .values({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags,
      period: project.period,
      link: project.link,
      teamId: project.teamId,
      isFeatured: project.isFeatured ?? false,
    })
    .returning();

  if (!data) {
    throw new Error("Failed to upload project: No data returned.");
  }

  return toProject(data);
}

export async function getFeaturedProjects(): Promise<
  ProjectDisplayInterface[]
> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.isFeatured, true));

    return await Promise.all(
      rows.map(async (row) => {
        const project = toProject(row);
        return toProjectDisplay(
          project,
          await buildTeamInfo(project.teamId, project.id)
        );
      })
    );
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export async function getFeaturedTeams(): Promise<{
  teams: TeamInterface[];
  members: Record<number, UserInterface[]>;
  projectCounts: Record<number, number>;
}> {
  try {
    const rows: TeamRow[] = await db
      .select()
      .from(teams)
      .where(eq(teams.isFeatured, true));

    const members: Record<number, UserInterface[]> = {};
    const projectCounts: Record<number, number> = {};

    await Promise.all(
      rows.map(async (team) => {
        try {
          members[team.id] = await getProfilesByTeam(team.id);
          projectCounts[team.id] = (await getProjectsByTeam(team.id)).length;
        } catch (error) {
          console.error(`Error fetching data for team ${team.id}:`, error);
          members[team.id] = [];
          projectCounts[team.id] = 0;
        }
      })
    );

    return { teams: rows.map(toTeam), members, projectCounts };
  } catch (error) {
    console.error("Error fetching featured teams:", error);
    return { teams: [], members: {}, projectCounts: {} };
  }
}

/**
 * STUDENT OPERATIONS
 */

export async function getStudentsForDisplay(): Promise<
  StudentDisplayInterface[]
> {
  try {
    const profileRows: ProfileRow[] = await db.select().from(profiles);
    const allProjects = await getAllProjects();
    const allTeams = await getAllTeams();

    return profileRows.map((profile) => {
      const teamInfo = profile.team
        ? allTeams.find((team) => team.id === profile.team)
        : null;

      const studentProjects = profile.team
        ? allProjects.filter((project) => project.teamId === profile.team)
        : [];

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
        image: resolveImageUrl(profile.avatarImage) || CLOUDINARY_DEFAULTS.profile,
      };
    });
  } catch (error) {
    console.error("Error fetching students for display:", error);
    return [];
  }
}

/**
 * RELATED DATA OPERATIONS
 */

export async function getCompleteTeamData(teamId: number): Promise<{
  team: TeamInterface | null;
  members: UserInterface[];
  projects: ProjectInterface[];
}> {
  const team = await getTeamById(teamId);
  const members = await getProfilesByTeam(teamId);
  const teamProjects = await getProjectsByTeam(teamId);
  return { team, members, projects: teamProjects };
}

/**
 * STATISTICS OPERATIONS
 */

export async function getTeamsCount(): Promise<number> {
  try {
    const [row] = await db.select({ value: count() }).from(teams);
    return row?.value ?? 0;
  } catch (error) {
    console.error("Error getting teams count:", error);
    return 0;
  }
}

export async function getProjectsCount(): Promise<number> {
  try {
    const [row] = await db.select({ value: count() }).from(projects);
    return row?.value ?? 0;
  } catch (error) {
    console.error("Error getting projects count:", error);
    return 0;
  }
}

export async function getTeamsWithAchievementsCount(): Promise<number> {
  try {
    const [row] = await db
      .select({ value: count() })
      .from(teams)
      .where(
        and(
          isNotNull(teams.achievements),
          ne(teams.achievements, ""),
          ne(teams.achievements, "[]")
        )
      );
    return row?.value ?? 0;
  } catch (error) {
    console.error("Error getting teams with achievements count:", error);
    return 0;
  }
}
