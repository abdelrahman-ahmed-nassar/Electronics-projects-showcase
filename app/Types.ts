/**
 * Interface for user profiles
 */
export interface UserInterface {
  id: string;
  name: string | null;
  email?: string | null;
  yearId: number | null;
  phone: string | null;
  nationalId: string | null;
  avatarImage: string | null;
  isGraduated: boolean | null;
  about: string | null;
  skills: string | null;
  specialization: string | null;
  role: string | null;
  team: number | null;
  projects: ProjectInterface[] | null;
}

/**
 * Interface for teams
 */
export interface TeamInterface {
  id: number;
  createdAt: string;
  name: string | null;
  description: string | null;
  achievements: string | null;
  specialty: string | null;
}

/**
 * Interface for projects
 */
export interface ProjectInterface {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  image: string | null;
  tags: string | null;
  period: string | null;
  link: string | null;
  teamId: number | null;
}