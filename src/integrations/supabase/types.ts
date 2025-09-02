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
      accountability_messages: {
        Row: {
          created_at: string
          id: string
          message_text: string
          partnership_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_text: string
          partnership_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_text?: string
          partnership_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_messages_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "accountability_partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      accountability_partnerships: {
        Row: {
          community_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_partnerships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          contact_info: Json | null
          created_at: string
          custom_beliefs_summary: string | null
          description: string | null
          doctrinal_statement_id: string | null
          id: string
          leader_id: string
          location_city: string
          location_lat: number
          location_lng: number
          location_state: string
          max_capacity: number | null
          meeting_day: string
          meeting_time: string
          member_count: number | null
          name: string
          tags: string[] | null
          trust_level: string | null
          updated_at: string
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string
          custom_beliefs_summary?: string | null
          description?: string | null
          doctrinal_statement_id?: string | null
          id?: string
          leader_id: string
          location_city: string
          location_lat: number
          location_lng: number
          location_state: string
          max_capacity?: number | null
          meeting_day: string
          meeting_time: string
          member_count?: number | null
          name: string
          tags?: string[] | null
          trust_level?: string | null
          updated_at?: string
        }
        Update: {
          contact_info?: Json | null
          created_at?: string
          custom_beliefs_summary?: string | null
          description?: string | null
          doctrinal_statement_id?: string | null
          id?: string
          leader_id?: string
          location_city?: string
          location_lat?: number
          location_lng?: number
          location_state?: string
          max_capacity?: number | null
          meeting_day?: string
          meeting_time?: string
          member_count?: number | null
          name?: string
          tags?: string[] | null
          trust_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_doctrinal_statement_id_fkey"
            columns: ["doctrinal_statement_id"]
            isOneToOne: false
            referencedRelation: "doctrinal_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      community_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string | null
          assignment_type: string
          community_id: string
          created_at: string
          description: string | null
          id: string
          scheduled_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to?: string | null
          assignment_type: string
          community_id: string
          created_at?: string
          description?: string | null
          id?: string
          scheduled_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string | null
          assignment_type?: string
          community_id?: string
          created_at?: string
          description?: string | null
          id?: string
          scheduled_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_assignments_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      doctrinal_statements: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          full_text: string
          id: string
          is_predefined: boolean | null
          name: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          full_text: string
          id?: string
          is_predefined?: boolean | null
          name: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          full_text?: string
          id?: string
          is_predefined?: boolean | null
          name?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leader_verifications: {
        Row: {
          doctrinal_affirmation: string
          id: string
          notes: string | null
          reference_contacts: string[]
          reference_leaders: string[]
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          testimony_of_faith: string
          user_id: string
        }
        Insert: {
          doctrinal_affirmation: string
          id?: string
          notes?: string | null
          reference_contacts: string[]
          reference_leaders: string[]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          testimony_of_faith: string
          user_id: string
        }
        Update: {
          doctrinal_affirmation?: string
          id?: string
          notes?: string | null
          reference_contacts?: string[]
          reference_leaders?: string[]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          testimony_of_faith?: string
          user_id?: string
        }
        Relationships: []
      }
      member_gifts: {
        Row: {
          community_id: string
          created_at: string
          description: string | null
          gift_category: string
          id: string
          is_available: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          description?: string | null
          gift_category: string
          id?: string
          is_available?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          description?: string | null
          gift_category?: string
          id?: string
          is_available?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_gifts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      multiplication_milestones: {
        Row: {
          achieved_at: string | null
          community_id: string
          created_at: string
          id: string
          milestone_type: string
          notes: string | null
        }
        Insert: {
          achieved_at?: string | null
          community_id: string
          created_at?: string
          id?: string
          milestone_type: string
          notes?: string | null
        }
        Update: {
          achieved_at?: string | null
          community_id?: string
          created_at?: string
          id?: string
          milestone_type?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multiplication_milestones_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      network_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          network_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          network_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          network_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_discussions_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "regional_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      network_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          max_attendees: number | null
          network_id: string
          organizer_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          network_id: string
          organizer_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          network_id?: string
          organizer_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_events_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "regional_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      network_memberships: {
        Row: {
          id: string
          joined_at: string
          network_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          network_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          network_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_memberships_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "regional_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      praise_reports: {
        Row: {
          community_id: string
          created_at: string
          description: string
          id: string
          prayer_request_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          description: string
          id?: string
          prayer_request_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          description?: string
          id?: string
          prayer_request_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "praise_reports_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praise_reports_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          category: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_anonymous: boolean
          is_urgent: boolean
          prayer_count: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_anonymous?: boolean
          is_urgent?: boolean
          prayer_count?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_anonymous?: boolean
          is_urgent?: boolean
          prayer_count?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_responses: {
        Row: {
          created_at: string
          id: string
          message: string | null
          prayer_request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          prayer_request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          prayer_request_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          location_city: string | null
          location_lat: number | null
          location_lng: number | null
          location_state: string | null
          privacy_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_state?: string | null
          privacy_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_state?: string | null
          privacy_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_discussions: {
        Row: {
          comment_text: string
          created_at: string
          id: string
          parent_comment_id: string | null
          reading_portion_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          reading_portion_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          reading_portion_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_discussions_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "reading_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_discussions_reading_portion_id_fkey"
            columns: ["reading_portion_id"]
            isOneToOne: false
            referencedRelation: "reading_portions"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          book_of_bible: string
          community_id: string
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          book_of_bible: string
          community_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          book_of_bible?: string
          community_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plans_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_portions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          reading_plan_id: string
          reading_text: string | null
          reflection_questions: string[] | null
          scripture_reference: string
          start_date: string
          title: string
          week_number: number
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          reading_plan_id: string
          reading_text?: string | null
          reflection_questions?: string[] | null
          scripture_reference: string
          start_date: string
          title: string
          week_number: number
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          reading_plan_id?: string
          reading_text?: string | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          start_date?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "reading_portions_reading_plan_id_fkey"
            columns: ["reading_plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_networks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          leader_id: string
          name: string
          region_city: string | null
          region_state: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          leader_id: string
          name: string
          region_city?: string | null
          region_state: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string
          name?: string
          region_city?: string | null
          region_state?: string
          updated_at?: string
        }
        Relationships: []
      }
      reporting_workflows: {
        Row: {
          created_at: string
          current_step: string
          formal_report_date: string | null
          formal_report_submitted: boolean | null
          id: string
          issue_description: string
          private_address_attempted: boolean | null
          private_address_date: string | null
          private_address_notes: string | null
          reported_community_id: string | null
          reported_user_id: string | null
          reporter_id: string
          resolution_notes: string | null
          resolution_status: string | null
          updated_at: string
          witness_brought: boolean | null
          witness_date: string | null
          witness_ids: string[] | null
          witness_notes: string | null
        }
        Insert: {
          created_at?: string
          current_step?: string
          formal_report_date?: string | null
          formal_report_submitted?: boolean | null
          id?: string
          issue_description: string
          private_address_attempted?: boolean | null
          private_address_date?: string | null
          private_address_notes?: string | null
          reported_community_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          resolution_notes?: string | null
          resolution_status?: string | null
          updated_at?: string
          witness_brought?: boolean | null
          witness_date?: string | null
          witness_ids?: string[] | null
          witness_notes?: string | null
        }
        Update: {
          created_at?: string
          current_step?: string
          formal_report_date?: string | null
          formal_report_submitted?: boolean | null
          id?: string
          issue_description?: string
          private_address_attempted?: boolean | null
          private_address_date?: string | null
          private_address_notes?: string | null
          reported_community_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          resolution_notes?: string | null
          resolution_status?: string | null
          updated_at?: string
          witness_brought?: boolean | null
          witness_date?: string | null
          witness_ids?: string[] | null
          witness_notes?: string | null
        }
        Relationships: []
      }
      resource_library: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author: string
          category: string
          content: string | null
          created_at: string
          created_by: string
          description: string
          external_url: string | null
          id: string
          is_approved: boolean | null
          recommended_communities: string[] | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author: string
          category: string
          content?: string | null
          created_at?: string
          created_by: string
          description: string
          external_url?: string | null
          id?: string
          is_approved?: boolean | null
          recommended_communities?: string[] | null
          resource_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author?: string
          category?: string
          content?: string | null
          created_at?: string
          created_by?: string
          description?: string
          external_url?: string | null
          id?: string
          is_approved?: boolean | null
          recommended_communities?: string[] | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_prayer_count: {
        Args: { request_id: string }
        Returns: undefined
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
