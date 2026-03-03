export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "jobseeker" | "employer" | "admin";
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "jobseeker" | "employer" | "admin";
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "jobseeker" | "employer" | "admin";
          phone?: string | null;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          address: string | null;
          prefecture: string | null;
          city: string | null;
          phone: string | null;
          employee_count: number | null;
          established_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          address?: string | null;
          prefecture?: string | null;
          city?: string | null;
          phone?: string | null;
          employee_count?: number | null;
          established_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          address?: string | null;
          prefecture?: string | null;
          city?: string | null;
          phone?: string | null;
          employee_count?: number | null;
          established_year?: number | null;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string;
          job_type: "full_time" | "part_time" | "contract" | "temporary";
          employment_status: "正社員" | "パート・アルバイト" | "契約社員" | "派遣社員";
          occupation: string;
          prefecture: string;
          city: string | null;
          address: string | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_type: "hourly" | "monthly" | "annual";
          working_hours: string | null;
          holidays: string | null;
          benefits: string | null;
          requirements: string | null;
          is_published: boolean;
          published_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          job_type: "full_time" | "part_time" | "contract" | "temporary";
          employment_status: "正社員" | "パート・アルバイト" | "契約社員" | "派遣社員";
          occupation: string;
          prefecture: string;
          city?: string | null;
          address?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_type: "hourly" | "monthly" | "annual";
          working_hours?: string | null;
          holidays?: string | null;
          benefits?: string | null;
          requirements?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          job_type?: "full_time" | "part_time" | "contract" | "temporary";
          employment_status?: "正社員" | "パート・アルバイト" | "契約社員" | "派遣社員";
          occupation?: string;
          prefecture?: string;
          city?: string | null;
          address?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_type?: "hourly" | "monthly" | "annual";
          working_hours?: string | null;
          holidays?: string | null;
          benefits?: string | null;
          requirements?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          expires_at?: string | null;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          applicant_id: string;
          status: "pending" | "reviewing" | "interview" | "offered" | "rejected" | "withdrawn";
          cover_letter: string | null;
          resume_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          applicant_id: string;
          status?: "pending" | "reviewing" | "interview" | "offered" | "rejected" | "withdrawn";
          cover_letter?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "reviewing" | "interview" | "offered" | "rejected" | "withdrawn";
          cover_letter?: string | null;
          resume_url?: string | null;
          updated_at?: string;
        };
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
