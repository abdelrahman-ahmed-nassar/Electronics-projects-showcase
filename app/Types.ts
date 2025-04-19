/**
 * Interface for user profiles
 */
export interface UserInterface {
  id: string; // uuid
  name: string | null; // text
  email?: string | null; // Added based on common usage, adjust if not in your actual auth schema
  yearId: number | null; // int2
  phone: string | null; // text
  nationalId: string | null; // text
  avatarImage: string | null; // text
  isGraduated: boolean | null; // bool
  about: string | null; // text
  skills: string | null; // text array (as requested)
  specialization: string | null; // text
  role: string | null; // text
  team: number | null; // int8
  projects: ProjectInterface[] | null;
}

/**
 * Interface for teams
 */
export interface TeamInterface {
  id: number;
  createdAt: string; // Assuming timestamp with time zone
  name: string | null;
  description: string | null;
  achievements: string | null;
  specialty: string | null;
}

/**
 * Interface for projects
 */
export interface ProjectInterface {
  id: number; // Primary key, typically serial or bigserial
  created_at: string; // timestamp with time zone
  title: string | null;
  description: string | null;
  image: string | null; // URL or path to image
  tags: string[] | null; // Changed to string array to match DB schema
  period: string | null; // e.g., "Jan 2023 - Mar 2023"
  link: string | null; // URL to project
  teamId: number | null; // Foreign key to teams table
}
