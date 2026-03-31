export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = 'admin' | 'moderator' | 'user';
export type TripStatus = 'active' | 'completed' | 'cancelled';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type NotificationType = 'booking' | 'message' | 'trip' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          bio: string | null;
          is_driver: boolean;
          vehicle_brand: string | null;
          vehicle_model: string | null;
          vehicle_color: string | null;
          license_plate: string | null;
          rating_avg: number;
          total_trips: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          bio?: string | null;
          is_driver?: boolean;
          vehicle_brand?: string | null;
          vehicle_model?: string | null;
          vehicle_color?: string | null;
          license_plate?: string | null;
          rating_avg?: number;
          total_trips?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          bio?: string | null;
          is_driver?: boolean;
          vehicle_brand?: string | null;
          vehicle_model?: string | null;
          vehicle_color?: string | null;
          license_plate?: string | null;
          rating_avg?: number;
          total_trips?: number;
          created_at?: string;
        };
      };
      user_roles: {
        Row: { id: string; user_id: string; role: AppRole };
        Insert: { id?: string; user_id: string; role: AppRole };
        Update: { id?: string; user_id?: string; role?: AppRole };
      };
      trips: {
        Row: {
          id: string;
          driver_id: string;
          from_city: string;
          from_address: string | null;
          to_city: string;
          to_address: string | null;
          stops: Json | null;
          departure_date: string;
          departure_time: string;
          price: number;
          seats_total: number;
          seats_available: number;
          status: TripStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          from_city: string;
          from_address?: string | null;
          to_city: string;
          to_address?: string | null;
          stops?: Json | null;
          departure_date: string;
          departure_time: string;
          price: number;
          seats_total: number;
          seats_available: number;
          status?: TripStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          from_city?: string;
          from_address?: string | null;
          to_city?: string;
          to_address?: string | null;
          stops?: Json | null;
          departure_date?: string;
          departure_time?: string;
          price?: number;
          seats_total?: number;
          seats_available?: number;
          status?: TripStatus;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          trip_id: string;
          passenger_id: string;
          status: BookingStatus;
          seats: number;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          passenger_id: string;
          status?: BookingStatus;
          seats?: number;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          passenger_id?: string;
          status?: BookingStatus;
          seats?: number;
          message?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          trip_id: string | null;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          trip_id?: string | null;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          trip_id?: string | null;
          content?: string;
          read_at?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: NotificationType;
          data: Json | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type: NotificationType;
          data?: Json | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          type?: NotificationType;
          data?: Json | null;
          read?: boolean;
          created_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          trip_id: string;
          from_user_id: string;
          to_user_id: string;
          score: number;
          tags: string[] | null;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          from_user_id: string;
          to_user_id: string;
          score: number;
          tags?: string[] | null;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          from_user_id?: string;
          to_user_id?: string;
          score?: number;
          tags?: string[] | null;
          comment?: string | null;
          created_at?: string;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          keys: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          keys: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          keys?: Json;
          created_at?: string;
        };
      };
    };
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      trip_status: TripStatus;
      booking_status: BookingStatus;
      notification_type: NotificationType;
    };
  };
}
