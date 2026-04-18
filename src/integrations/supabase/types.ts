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
      bookings: {
        Row: {
          created_at: string
          driver_payout: number | null
          id: string
          is_private: boolean
          message: string | null
          passenger_id: string
          platform_fee: number | null
          seats: number
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_payout?: number | null
          id?: string
          is_private?: boolean
          message?: string | null
          passenger_id: string
          platform_fee?: number | null
          seats?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_payout?: number | null
          id?: string
          is_private?: boolean
          message?: string | null
          passenger_id?: string
          platform_fee?: number | null
          seats?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_availability: {
        Row: {
          available_until: string | null
          is_available: boolean
          lat: number | null
          lng: number | null
          radius_km: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_until?: string | null
          is_available?: boolean
          lat?: number | null
          lng?: number | null
          radius_km?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_until?: string | null
          is_available?: boolean
          lat?: number | null
          lng?: number | null
          radius_km?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      identity_documents: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          status: Database["public"]["Enums"]["id_doc_status"]
          type: Database["public"]["Enums"]["id_doc_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["id_doc_status"]
          type: Database["public"]["Enums"]["id_doc_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["id_doc_status"]
          type?: Database["public"]["Enums"]["id_doc_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
          trip_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
          trip_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          brand: string
          created_at: string
          expiry: string
          id: string
          is_default: boolean
          last4: string
          stripe_payment_method_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          expiry: string
          id?: string
          is_default?: boolean
          last4: string
          stripe_payment_method_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          expiry?: string
          id?: string
          is_default?: boolean
          last4?: string
          stripe_payment_method_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          dark_mode: boolean
          full_name: string | null
          id: string
          is_driver: boolean
          language: string
          license_plate: string | null
          notif_email: boolean
          notif_push: boolean
          notif_sms: boolean
          phone: string | null
          rating_avg: number
          show_whatsapp: boolean
          total_trips: number
          updated_at: string
          vehicle_brand: string | null
          vehicle_color: string | null
          vehicle_model: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          dark_mode?: boolean
          full_name?: string | null
          id: string
          is_driver?: boolean
          language?: string
          license_plate?: string | null
          notif_email?: boolean
          notif_push?: boolean
          notif_sms?: boolean
          phone?: string | null
          rating_avg?: number
          show_whatsapp?: boolean
          total_trips?: number
          updated_at?: string
          vehicle_brand?: string | null
          vehicle_color?: string | null
          vehicle_model?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          dark_mode?: boolean
          full_name?: string | null
          id?: string
          is_driver?: boolean
          language?: string
          license_plate?: string | null
          notif_email?: boolean
          notif_push?: boolean
          notif_sms?: boolean
          phone?: string | null
          rating_avg?: number
          show_whatsapp?: boolean
          total_trips?: number
          updated_at?: string
          vehicle_brand?: string | null
          vehicle_color?: string | null
          vehicle_model?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          keys: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          keys: Json
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          keys?: Json
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          from_user_id: string
          id: string
          score: number
          tags: string[] | null
          to_user_id: string
          trip_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          from_user_id: string
          id?: string
          score: number
          tags?: string[] | null
          to_user_id: string
          trip_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          from_user_id?: string
          id?: string
          score?: number
          tags?: string[] | null
          to_user_id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_requests: {
        Row: {
          accepts_animals: boolean
          accepts_luggage: boolean
          created_at: string
          desired_date: string
          desired_time: string | null
          from_city: string
          id: string
          is_private: boolean
          proposed_price: number | null
          publisher_id: string
          seats_needed: number
          status: Database["public"]["Enums"]["trip_request_status"]
          to_city: string
          updated_at: string
        }
        Insert: {
          accepts_animals?: boolean
          accepts_luggage?: boolean
          created_at?: string
          desired_date: string
          desired_time?: string | null
          from_city: string
          id?: string
          is_private?: boolean
          proposed_price?: number | null
          publisher_id: string
          seats_needed?: number
          status?: Database["public"]["Enums"]["trip_request_status"]
          to_city: string
          updated_at?: string
        }
        Update: {
          accepts_animals?: boolean
          accepts_luggage?: boolean
          created_at?: string
          desired_date?: string
          desired_time?: string | null
          from_city?: string
          id?: string
          is_private?: boolean
          proposed_price?: number | null
          publisher_id?: string
          seats_needed?: number
          status?: Database["public"]["Enums"]["trip_request_status"]
          to_city?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_requests_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          accepts_animals: boolean
          accepts_luggage: boolean
          created_at: string
          departure_date: string
          departure_time: string
          driver_id: string
          estimated_arrival_time: string | null
          from_address: string | null
          from_city: string
          from_lat: number | null
          from_lng: number | null
          id: string
          is_recurring: boolean
          price: number
          recurrence_pattern: Json | null
          return_trip_id: string | null
          seats_available: number
          seats_total: number
          status: Database["public"]["Enums"]["trip_status"]
          stops: Json | null
          to_address: string | null
          to_city: string
          to_lat: number | null
          to_lng: number | null
          updated_at: string
        }
        Insert: {
          accepts_animals?: boolean
          accepts_luggage?: boolean
          created_at?: string
          departure_date: string
          departure_time: string
          driver_id: string
          estimated_arrival_time?: string | null
          from_address?: string | null
          from_city: string
          from_lat?: number | null
          from_lng?: number | null
          id?: string
          is_recurring?: boolean
          price: number
          recurrence_pattern?: Json | null
          return_trip_id?: string | null
          seats_available?: number
          seats_total?: number
          status?: Database["public"]["Enums"]["trip_status"]
          stops?: Json | null
          to_address?: string | null
          to_city: string
          to_lat?: number | null
          to_lng?: number | null
          updated_at?: string
        }
        Update: {
          accepts_animals?: boolean
          accepts_luggage?: boolean
          created_at?: string
          departure_date?: string
          departure_time?: string
          driver_id?: string
          estimated_arrival_time?: string | null
          from_address?: string | null
          from_city?: string
          from_lat?: number | null
          from_lng?: number | null
          id?: string
          is_recurring?: boolean
          price?: number
          recurrence_pattern?: Json | null
          return_trip_id?: string | null
          seats_available?: number
          seats_total?: number
          status?: Database["public"]["Enums"]["trip_status"]
          stops?: Json | null
          to_address?: string | null
          to_city?: string
          to_lat?: number | null
          to_lng?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_return_trip_id_fkey"
            columns: ["return_trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          _body: string
          _data?: Json
          _title: string
          _type: Database["public"]["Enums"]["notification_type"]
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_status: "pending" | "accepted" | "rejected" | "cancelled"
      id_doc_status: "pending" | "verified" | "rejected"
      id_doc_type: "id_card" | "selfie" | "license" | "phone"
      notification_type: "booking" | "message" | "trip" | "system"
      trip_request_status: "active" | "matched" | "cancelled" | "expired"
      trip_status: "active" | "completed" | "cancelled"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      booking_status: ["pending", "accepted", "rejected", "cancelled"],
      id_doc_status: ["pending", "verified", "rejected"],
      id_doc_type: ["id_card", "selfie", "license", "phone"],
      notification_type: ["booking", "message", "trip", "system"],
      trip_request_status: ["active", "matched", "cancelled", "expired"],
      trip_status: ["active", "completed", "cancelled"],
    },
  },
} as const
