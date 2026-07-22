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
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lookbook: {
        Row: {
          created_at: string | null
          id: string
          image: string
          order_index: number | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image: string
          order_index?: number | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string
          order_index?: number | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          color: string | null
          created_at: string | null
          currency: string | null
          estimated_delivery: string | null
          id: string
          items: Json
          payment_method: string | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_carrier: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          currency?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          payment_method?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_carrier?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          currency?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          payment_method?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_carrier?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      productivity_notes: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      productivity_projects: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          icon: string
          id: string
          progress: number
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          icon?: string
          id?: string
          progress?: number
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          icon?: string
          id?: string
          progress?: number
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      productivity_tasks: {
        Row: {
          created_at: string | null
          done: boolean
          due_at: string | null
          id: string
          sort_order: number
          tag: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          done?: boolean
          due_at?: string | null
          id?: string
          sort_order?: number
          tag?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          done?: boolean
          due_at?: string | null
          id?: string
          sort_order?: number
          tag?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          collection_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_new: boolean | null
          name: string
          price: number
          size: string[] | null
          size_quantities: Json | null
          slug: string
          stock: number
          updated_at: string | null
        }
        Insert: {
          collection_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_new?: boolean | null
          name: string
          price?: number
          size?: string[] | null
          size_quantities?: Json | null
          slug: string
          stock?: number
          updated_at?: string | null
        }
        Update: {
          collection_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_new?: boolean | null
          name?: string
          price?: number
          size?: string[] | null
          size_quantities?: Json | null
          slug?: string
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          banned_at: string | null
          banned_by: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_banned: boolean
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_banned?: boolean
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_banned?: boolean
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_admin_audit: {
        Row: {
          action: string
          actor_id: string | null
          after_val: Json | null
          before_val: Json | null
          created_at: string
          id: string
          note: string | null
          target_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_val?: Json | null
          before_val?: Json | null
          created_at?: string
          id?: string
          note?: string | null
          target_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_val?: Json | null
          before_val?: Json | null
          created_at?: string
          id?: string
          note?: string | null
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_admin_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_admin_audit_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          read: boolean
          replied_at: string | null
          reply_body: string | null
          status: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          replied_at?: string | null
          reply_body?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          replied_at?: string | null
          reply_body?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
