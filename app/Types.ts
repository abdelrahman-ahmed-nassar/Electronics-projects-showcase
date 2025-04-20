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

export interface StudentDisplayInterface {
  id: string;
  name: string;
  level: string;
  specialization: string;
  team: string;
  role: string;
  bio: string;
  skills: string[];
  projects: {
    id: number;
    title: string;
    role: string;
    description: string;
  }[];
  image: string;
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
  image: string | null;
  isFeatured?: boolean | null; // Assuming this is a boolean field
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
  isFeatured?: boolean | null; // Flag for featured projects
}

export interface ProjectDisplayInterface {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  dateCreated: string;
  link: string | null;
  team: {
    name: string;
    id: number | null;
    members: {
      name: string;
      role: string;
      image: string | null;
      id: string;
    }[];
  };
}
