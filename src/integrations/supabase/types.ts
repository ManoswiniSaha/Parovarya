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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contributions: {
        Row: {
          consent_confirmed: boolean
          contribution_type: string
          contributor_name: string
          created_at: string
          description: string | null
          external_url: string | null
          heritage_project_id: string
          id: string
          source: string | null
          title: string
        }
        Insert: {
          consent_confirmed?: boolean
          contribution_type: string
          contributor_name: string
          created_at?: string
          description?: string | null
          external_url?: string | null
          heritage_project_id: string
          id?: string
          source?: string | null
          title: string
        }
        Update: {
          consent_confirmed?: boolean
          contribution_type?: string
          contributor_name?: string
          created_at?: string
          description?: string | null
          external_url?: string | null
          heritage_project_id?: string
          id?: string
          source?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_heritage_project_id_fkey"
            columns: ["heritage_project_id"]
            isOneToOne: false
            referencedRelation: "heritage_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      heritage_projects: {
        Row: {
          category: string
          city: string
          community: string | null
          created_at: string
          cultural_significance: string | null
          description: string
          district: string | null
          historical_context: string | null
          id: string
          latitude: number | null
          local_name: string | null
          longitude: number | null
          slug: string
          state: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          city: string
          community?: string | null
          created_at?: string
          cultural_significance?: string | null
          description: string
          district?: string | null
          historical_context?: string | null
          id?: string
          latitude?: number | null
          local_name?: string | null
          longitude?: number | null
          slug: string
          state: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string
          community?: string | null
          created_at?: string
          cultural_significance?: string | null
          description?: string
          district?: string | null
          historical_context?: string | null
          id?: string
          latitude?: number | null
          local_name?: string | null
          longitude?: number | null
          slug?: string
          state?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_sources: {
        Row: {
          created_at: string
          description: string | null
          heritage_project_id: string
          id: string
          source_type: string | null
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          heritage_project_id: string
          id?: string
          source_type?: string | null
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          heritage_project_id?: string
          id?: string
          source_type?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_sources_heritage_project_id_fkey"
            columns: ["heritage_project_id"]
            isOneToOne: false
            referencedRelation: "heritage_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timeline: {
        Row: {
          created_at: string
          event_date: string | null
          event_description: string | null
          event_title: string
          heritage_project_id: string
          id: string
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          event_description?: string | null
          event_title: string
          heritage_project_id: string
          id?: string
        }
        Update: {
          created_at?: string
          event_date?: string | null
          event_description?: string | null
          event_title?: string
          heritage_project_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_heritage_project_id_fkey"
            columns: ["heritage_project_id"]
            isOneToOne: false
            referencedRelation: "heritage_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
