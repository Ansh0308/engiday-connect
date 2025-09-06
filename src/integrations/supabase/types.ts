export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          club_name: string
          created_at: string
          description: string | null
          id: string
          max_team_size: number
          min_team_size: number
          name: string
          poster_url: string | null
          updated_at: string
        }
        Insert: {
          club_name: string
          created_at?: string
          description?: string | null
          id?: string
          max_team_size?: number
          min_team_size?: number
          name: string
          poster_url?: string | null
          updated_at?: string
        }
        Update: {
          club_name?: string
          created_at?: string
          description?: string | null
          id?: string
          max_team_size?: number
          min_team_size?: number
          name?: string
          poster_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          created_at: string
          expires_at: string
          gr_number: string
          id: string
          otp_code: string
          registration_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          gr_number: string
          id?: string
          otp_code: string
          registration_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          gr_number?: string
          id?: string
          otp_code?: string
          registration_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          all_members_verified: boolean | null
          created_at: string
          event_id: string
          id: string
          otp_verified: boolean | null
          registration_status: string | null
          team_leader_department: string
          team_leader_email: string
          team_leader_enrollment: string
          team_leader_gr: string | null
          team_leader_name: string
          team_leader_program: string
          team_leader_semester: number
          team_leader_verified: boolean | null
          team_member_grs: string[] | null
          team_members: Json | null
          verification_status: string | null
          verified: boolean | null
        }
        Insert: {
          all_members_verified?: boolean | null
          created_at?: string
          event_id: string
          id?: string
          otp_verified?: boolean | null
          registration_status?: string | null
          team_leader_department: string
          team_leader_email: string
          team_leader_enrollment: string
          team_leader_gr?: string | null
          team_leader_name: string
          team_leader_program: string
          team_leader_semester: number
          team_leader_verified?: boolean | null
          team_member_grs?: string[] | null
          team_members?: Json | null
          verification_status?: string | null
          verified?: boolean | null
        }
        Update: {
          all_members_verified?: boolean | null
          created_at?: string
          event_id?: string
          id?: string
          otp_verified?: boolean | null
          registration_status?: string | null
          team_leader_department?: string
          team_leader_email?: string
          team_leader_enrollment?: string
          team_leader_gr?: string | null
          team_leader_name?: string
          team_leader_program?: string
          team_leader_semester?: number
          team_leader_verified?: boolean | null
          team_member_grs?: string[] | null
          team_members?: Json | null
          verification_status?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          class: string
          created_at: string
          email: string
          gr_number: string
          name: string
          semester: number
          updated_at: string
        }
        Insert: {
          class: string
          created_at?: string
          email: string
          gr_number: string
          name: string
          semester: number
          updated_at?: string
        }
        Update: {
          class?: string
          created_at?: string
          email?: string
          gr_number?: string
          name?: string
          semester?: number
          updated_at?: string
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          registration_id: string | null
          token: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          registration_id?: string | null
          token: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          registration_id?: string | null
          token?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_tokens_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_all_members_verified: {
        Args: { reg_id: string }
        Returns: boolean
      }
      verify_admin_credentials: {
        Args: { p_password: string; p_username: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
