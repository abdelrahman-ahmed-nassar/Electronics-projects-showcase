export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // uuid
          name: string | null;
          phone: string | null;
          nationalId: string | null; 
          avatarImage: string | null;
          isGraduated: boolean | null;
          about: string | null;
          specialization: string | null;
          role: string | null;
          team: number | null; // int8 (bigint)
          skills: string | null; // array
        };
        Insert: {
          id?: string; // uuid
          name?: string | null;
          phone?: string | null;
          nationalId?: string | null;
          avatarImage?: string | null;
          isGraduated?: boolean | null;
          about?: string | null;
          specialization?: string | null;
          role?: string | null;
          team?: number | null;
          skills?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          phone?: string | null;
          nationalId?: string | null;
          avatarImage?: string | null;
          isGraduated?: boolean | null;
          about?: string | null;
          specialization?: string | null;
          role?: string | null;
          team?: number | null;
          skills?: string | null;
        };
      };
      projects: {
        Row: {
          id: number; // int8
          created_at: string; // timestamp
          title: string | null;
          description: string | null;
          image: string | null;
          tags: string[] | null; // array
          period: string | null;
          link: string | null;
          teamId: number | null; // int8
          isFeatured: boolean | null; // bool
        };
        Insert: {
          id?: number;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          image?: string | null;
          tags?: string[] | null;
          period?: string | null;
          link?: string | null;
          teamId?: number | null;
          isFeatured?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          image?: string | null;
          tags?: string[] | null;
          period?: string | null;
          link?: string | null;
          teamId?: number | null;
          isFeatured?: boolean | null;
        };
      };
      teams: {
        Row: {
          id: number; // int8
          createdAt: string; // timestamp
          name: string | null;
          description: string | null;
          achievements: string | null; // array (corrected spelling from "achivements")
          specialty: string | null;
          image: string | null;
          isFeatured: boolean | null; // bool
        };
        Insert: {
          id?: number;
          createdAt?: string;
          name?: string | null;
          description?: string | null;
          achievements?: string | null;
          specialty?: string | null;
          image?: string | null;
          isFeatured?: boolean | null;
        };
        Update: {
          id?: number;
          createdAt?: string;
          name?: string | null;
          description?: string | null;
          achievements?: string | null;
          specialty?: string | null;
          image?: string | null;
          isFeatured?: boolean | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};