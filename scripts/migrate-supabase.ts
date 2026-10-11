import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { count, sql } from "drizzle-orm";
import * as schema from "../db/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

const db = drizzle(process.env.DATABASE_URL!, { schema });
const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
const CHUNK = 100;

type AuthUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at: string | null;
  user_metadata: { name?: string; full_name?: string } | null;
};

type SbProfile = {
  id: string;
  name: string | null;
  phone: string | null;
  nationalId: string | null;
  avatarImage: string | null;
  isGraduated: boolean | null;
  about: string | null;
  specialization: string | null;
  role: string | null;
  team: number | null;
  skills: string | null;
};

type SbTeam = {
  id: number;
  createdAt: string;
  name: string | null;
  description: string | null;
  achievements: string | null;
  specialty: string | null;
  image: string | null;
  isFeatured: boolean | null;
};

type SbProject = {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  image: string | null;
  link: string | null;
  period: string | null;
  tags: string[] | null;
  teamId: number | null;
  isFeatured: boolean | null;
};

async function supabaseGet<T>(path: string): Promise<T> {
  const res = await fetch(`${supabaseUrl}${path}`, { headers });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function fetchTable<T>(table: string): Promise<T[]> {
  return supabaseGet<T[]>(`/rest/v1/${table}?select=*`);
}

async function fetchAuthUsers(): Promise<AuthUser[]> {
  const users: AuthUser[] = [];
  for (let page = 1; ; page++) {
    const body = await supabaseGet<{ users?: AuthUser[] } | AuthUser[]>(
      `/auth/v1/admin/users?page=${page}&per_page=1000`
    );
    const batch = Array.isArray(body) ? body : (body.users ?? []);
    users.push(...batch);
    if (batch.length < 1000) break;
  }
  return users;
}

async function insertChunked<T extends object>(
  table: Parameters<typeof db.insert>[0],
  rows: T[]
) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    if (slice.length === 0) continue;
    await db.insert(table).values(slice as never).onConflictDoNothing();
  }
}

async function main() {
  const [authUsers, sbProfiles, sbTeams, sbProjects] = await Promise.all([
    fetchAuthUsers(),
    fetchTable<SbProfile>("profiles"),
    fetchTable<SbTeam>("teams"),
    fetchTable<SbProject>("projects"),
  ]);

  console.log(
    `Supabase: ${authUsers.length} auth users, ${sbProfiles.length} profiles, ${sbTeams.length} teams, ${sbProjects.length} projects`
  );

  const profileById = new Map(sbProfiles.map((p) => [p.id, p]));
  const userIds = new Set(authUsers.map((u) => u.id));
  const teamIds = new Set(sbTeams.map((t) => t.id));

  const userRows = authUsers.map((u) => {
    const profile = profileById.get(u.id);
    const name =
      profile?.name ||
      u.user_metadata?.name ||
      u.user_metadata?.full_name ||
      u.email.split("@")[0];
    return {
      id: u.id,
      name,
      email: u.email.toLowerCase(),
      emailVerified: Boolean(u.email_confirmed_at),
      image: null,
      createdAt: new Date(u.created_at),
      updatedAt: new Date(u.updated_at),
    };
  });
  await insertChunked(schema.user, userRows);

  const teamRows = sbTeams.map((t) => ({
    id: t.id,
    createdAt: new Date(t.createdAt),
    name: t.name,
    description: t.description,
    achievements: t.achievements,
    specialty: t.specialty,
    image: t.image,
    isFeatured: t.isFeatured ?? false,
  }));
  await insertChunked(schema.teams, teamRows);

  let droppedProfileTeams = 0;
  let skippedProfiles = 0;
  const profileRows = sbProfiles.flatMap((p) => {
    if (!userIds.has(p.id)) {
      skippedProfiles++;
      return [];
    }
    let team = p.team;
    if (team != null && !teamIds.has(team)) {
      droppedProfileTeams++;
      team = null;
    }
    return [
      {
        id: p.id,
        name: p.name,
        phone: p.phone,
        nationalId: p.nationalId,
        avatarImage: p.avatarImage,
        isGraduated: p.isGraduated ?? false,
        about: p.about,
        specialization: p.specialization,
        role: p.role,
        team,
        skills: p.skills,
      },
    ];
  });
  await insertChunked(schema.profiles, profileRows);

  let droppedProjectTeams = 0;
  const projectRows = sbProjects.map((p) => {
    let teamId = p.teamId;
    if (teamId != null && !teamIds.has(teamId)) {
      droppedProjectTeams++;
      teamId = null;
    }
    return {
      id: p.id,
      created_at: new Date(p.created_at),
      title: p.title,
      description: p.description,
      image: p.image,
      link: p.link,
      period: p.period,
      tags: p.tags,
      teamId,
      isFeatured: p.isFeatured ?? false,
    };
  });
  await insertChunked(schema.projects, projectRows);

  await db.execute(sql`
    SELECT setval(pg_get_serial_sequence('teams', 'id'), (SELECT COALESCE(MAX(id), 1) FROM teams), true)
  `);
  await db.execute(sql`
    SELECT setval(pg_get_serial_sequence('projects', 'id'), (SELECT COALESCE(MAX(id), 1) FROM projects), true)
  `);

  const [users, teams, profiles, projects] = await Promise.all([
    db.select({ n: count() }).from(schema.user),
    db.select({ n: count() }).from(schema.teams),
    db.select({ n: count() }).from(schema.profiles),
    db.select({ n: count() }).from(schema.projects),
  ]);

  console.log(
    `Neon after migration: ${users[0].n} users, ${teams[0].n} teams, ${profiles[0].n} profiles, ${projects[0].n} projects`
  );
  console.log(
    `Skipped profiles without auth user: ${skippedProfiles}; team links cleared on profiles: ${droppedProfileTeams}; team links cleared on projects: ${droppedProjectTeams}`
  );
}

main().catch((err) => {
  const cause = (err as { cause?: { message?: string; detail?: string; constraint?: string; code?: string } }).cause;
  console.error("Migration failed:", (err as Error).message.split(" params:")[0].slice(0, 200));
  console.error("Cause:", cause?.code, cause?.constraint, cause?.message, cause?.detail);
  process.exit(1);
});
