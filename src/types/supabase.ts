export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_parsed_content: {
        Row: {
          created_at: string | null
          id: string
          parsed_content: Json | null
          report_content_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parsed_content?: Json | null
          report_content_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parsed_content?: Json | null
          report_content_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_parsed_content_report_content_id_fkey"
            columns: ["report_content_id"]
            isOneToOne: false
            referencedRelation: "report_content"
            referencedColumns: ["id"]
          },
        ]
      }
      component_types: {
        Row: {
          id: number
          is_mandatory: boolean
          name: string
          order_index: number
        }
        Insert: {
          id?: number
          is_mandatory?: boolean
          name: string
          order_index: number
        }
        Update: {
          id?: number
          is_mandatory?: boolean
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      components: {
        Row: {
          ai_prompt_professional: string | null
          ai_prompt_technical: string | null
          id: string
          json_structure: Json | null
          type_id: number | null
        }
        Insert: {
          ai_prompt_professional?: string | null
          ai_prompt_technical?: string | null
          id?: string
          json_structure?: Json | null
          type_id?: number | null
        }
        Update: {
          ai_prompt_professional?: string | null
          ai_prompt_technical?: string | null
          id?: string
          json_structure?: Json | null
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "components_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      report_content: {
        Row: {
          component_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          raw_notes: string | null
          report_id: string | null
          updated_at: string | null
        }
        Insert: {
          component_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          raw_notes?: string | null
          report_id?: string | null
          updated_at?: string | null
        }
        Update: {
          component_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          raw_notes?: string | null
          report_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_content_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_content_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
