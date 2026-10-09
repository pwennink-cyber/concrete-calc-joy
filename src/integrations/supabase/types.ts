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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      booking_requests: {
        Row: {
          access_notes: string | null
          access_within_four_meters: string
          asap: boolean
          billing_city: string | null
          billing_postcode: string | null
          billing_same_as_delivery: boolean
          billing_street: string | null
          company_name: string | null
          concrete_type: string
          created_at: string
          customer_type: string
          delivery_city: string
          delivery_postcode: string
          delivery_street: string
          dimensions: Json | null
          distance_meters: number | null
          email: string
          extra_hose_meters: number
          first_name: string
          flexible_planning: boolean
          id: string
          internal_reference: string | null
          last_name: string
          net_volume_m3: number
          obstacles: string | null
          order_volume_m3: number
          phone: string
          preferred_date: string | null
          preferred_timeslot: string | null
          price_lines: Json
          project_notes: string | null
          project_type: string
          request_number: string
          safety_margin_m3: number
          status: string
          subtotal_ex_vat: number
          total_inc_vat: number
          unloading_method: string
          unloading_minutes: number | null
          vat_amount: number
        }
        Insert: {
          access_notes?: string | null
          access_within_four_meters: string
          asap?: boolean
          billing_city?: string | null
          billing_postcode?: string | null
          billing_same_as_delivery?: boolean
          billing_street?: string | null
          company_name?: string | null
          concrete_type: string
          created_at?: string
          customer_type: string
          delivery_city: string
          delivery_postcode: string
          delivery_street: string
          dimensions?: Json | null
          distance_meters?: number | null
          email: string
          extra_hose_meters?: number
          first_name: string
          flexible_planning?: boolean
          id?: string
          internal_reference?: string | null
          last_name: string
          net_volume_m3: number
          obstacles?: string | null
          order_volume_m3: number
          phone: string
          preferred_date?: string | null
          preferred_timeslot?: string | null
          price_lines?: Json
          project_notes?: string | null
          project_type: string
          request_number: string
          safety_margin_m3?: number
          status?: string
          subtotal_ex_vat: number
          total_inc_vat: number
          unloading_method: string
          unloading_minutes?: number | null
          vat_amount: number
        }
        Update: {
          access_notes?: string | null
          access_within_four_meters?: string
          asap?: boolean
          billing_city?: string | null
          billing_postcode?: string | null
          billing_same_as_delivery?: boolean
          billing_street?: string | null
          company_name?: string | null
          concrete_type?: string
          created_at?: string
          customer_type?: string
          delivery_city?: string
          delivery_postcode?: string
          delivery_street?: string
          dimensions?: Json | null
          distance_meters?: number | null
          email?: string
          extra_hose_meters?: number
          first_name?: string
          flexible_planning?: boolean
          id?: string
          internal_reference?: string | null
          last_name?: string
          net_volume_m3?: number
          obstacles?: string | null
          order_volume_m3?: number
          phone?: string
          preferred_date?: string | null
          preferred_timeslot?: string | null
          price_lines?: Json
          project_notes?: string | null
          project_type?: string
          request_number?: string
          safety_margin_m3?: number
          status?: string
          subtotal_ex_vat?: number
          total_inc_vat?: number
          unloading_method?: string
          unloading_minutes?: number | null
          vat_amount?: number
        }
        Relationships: []
      }
      callback_requests: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          preferred_moment: string | null
          question: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          preferred_moment?: string | null
          question?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          preferred_moment?: string | null
          question?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      next_booking_request_number: { Args: never; Returns: string }
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
