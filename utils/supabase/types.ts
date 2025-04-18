export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          price: number | null;
          tag: string | null;
          lastUpdated: string | null;
          teacherId: number | null;
          image: string | null;
          yearId: number;
          publishedDate: string | null;
          courseOrder: number | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          price?: number | null;
          tag?: string | null;
          lastUpdated?: string | null;
          teacherId?: number | null;
          image?: string | null;
          yearId: number;
          publishedDate?: string | null;
          courseOrder?: number | null;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          price?: number | null;
          tag?: string | null;
          lastUpdated?: string | null;
          teacherId?: number | null;
          image?: string | null;
          yearId?: number;
          publishedDate?: string | null;
          courseOrder?: number | null;
        };
      };
      featuredCourses: {
        Row: {
          id: number;
          date: string;
          courseId: number;
          isActive: boolean;
        };
        Insert: {
          id?: number;
          date: string;
          courseId: number;
          isActive?: boolean;
        };
        Update: {
          id?: number;
          date?: string;
          courseId?: number;
          isActive?: boolean;
        };
      };
      years: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          createdAt: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          createdAt?: string;
        };
      };
      teachers: {
        Row: {
          id: number;
          date: string;
          name: string;
        };
        Insert: {
          id?: number;
          date: string;
          name: string;
        };
        Update: {
          id?: number;
          date?: string;
          name?: string;
        };
      };
      profiles: {
        Row: {
          id: string; // uuid
          about: string | null;
          avatarImage: string | null;
          isGraduated: boolean | null;
          name: string | null;
          nationalId: string | null;
          phone: string | null;
          role: string | null;
          skills: string[] | null;
          specialization: string | null;
          team: number | null; // bigint, foreign key to teams.id
          yearId: number | null; // smallint
        };
        Insert: {
          id?: string; // uuid, default: gen_random_uuid()
          about?: string | null;
          avatarImage?: string | null;
          isGraduated?: boolean | null;
          name?: string | null;
          nationalId?: string | null;
          phone?: string | null;
          role?: string | null;
          skills?: string[] | null;
          specialization?: string | null;
          team?: number | null;
          yearId?: number | null;
        };
        Update: {
          id?: string;
          about?: string | null;
          avatarImage?: string | null;
          isGraduated?: boolean | null;
          name?: string | null;
          nationalId?: string | null;
          phone?: string | null;
          role?: string | null;
          skills?: string[] | null;
          specialization?: string | null;
          team?: number | null;
          yearId?: number | null;
        };
      };
      units: {
        Row: {
          id: number;
          date: string;
          name: string;
          courseId: number;
          courseOrder: number | null;
          description: string | null;
        };
        Insert: {
          id?: number;
          date: string;
          name: string;
          courseId: number;
          courseOrder?: number | null;
          description?: string | null;
        };
        Update: {
          id?: number;
          date?: string;
          name?: string;
          courseId?: number;
          courseOrder?: number | null;
          description?: string | null;
        };
      };
      packages: {
        Row: {
          id: number;
          date: string;
          name: string;
          description: string | null;
          price: number;
          courseId: number;
        };
        Insert: {
          id?: number;
          date: string;
          name: string;
          description?: string | null;
          price: number;
          courseId: number;
        };
        Update: {
          id?: number;
          date?: string;
          name?: string;
          description?: string | null;
          price?: number;
          courseId?: number;
        };
      };
      codes: {
        Row: {
          id: number;
          date: string;
          name: string;
          balance: number;
        };
        Insert: {
          id?: number;
          date: string;
          name: string;
          balance: number;
        };
        Update: {
          id?: number;
          date?: string;
          name?: string;
          balance?: number;
        };
      };
      lectures: {
        Row: {
          id: number;
          date: string;
          name: string;
          description: string | null;
          unitId: number;
          lectureOrder: number | null;
          preview_content: string | null;
          full_content: string | null;
          is_preview: boolean;
        };
        Insert: {
          id?: number;
          date?: string;
          name: string;
          description?: string | null;
          unitId: number;
          lectureOrder?: number | null;
          preview_content?: string | null;
          full_content?: string | null;
          is_preview?: boolean;
        };
        Update: {
          id?: number;
          date?: string;
          name?: string;
          description?: string | null;
          unitId?: number;
          lectureOrder?: number | null;
          preview_content?: string | null;
          full_content?: string | null;
          is_preview?: boolean;
        };
      };
      user_courses: {
        Row: {
          id: number;
          date: string;
          userId: string;
          courseId: number;
        };
        Insert: {
          id?: number;
          date?: string;
          userId: string;
          courseId: number;
        };
        Update: {
          id?: number;
          date?: string;
          userId?: string;
          courseId?: number;
        };
      };
      teams: {
        Row: {
          id: number; // bigint, primary key
          name: string | null;
          specialty: string | null;
          description: string | null;
          achivements: string[] | null; // array
          createdAt: string; // timestamp with time zone
        };
        Insert: {
          id?: number; // bigint, primary key
          name?: string | null;
          specialty?: string | null;
          description?: string | null;
          achivements?: string[] | null;
          createdAt?: string; // defaults to now()
        };
        Update: {
          id?: number;
          name?: string | null;
          specialty?: string | null;
          description?: string | null;
          achivements?: string[] | null;
          createdAt?: string;
        };
      };
      projects: {
        Row: {
          id: number; // bigint, primary key
          title: string | null;
          description: string | null;
          image: string | null;
          link: string | null;
          period: string | null;
          tags: string[] | null; // array
          teamId: number | null; // bigint, foreign key to teams.id
          created_at: string; // timestamp with time zone
        };
        Insert: {
          id?: number; // bigint, primary key
          title?: string | null;
          description?: string | null;
          image?: string | null;
          link?: string | null;
          period?: string | null;
          tags?: string[] | null;
          teamId?: number | null;
          created_at?: string; // defaults to now()
        };
        Update: {
          id?: number;
          title?: string | null;
          description?: string | null;
          image?: string | null;
          link?: string | null;
          period?: string | null;
          tags?: string[] | null;
          teamId?: number | null;
          created_at?: string;
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
