export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = 'admin' | 'moderator' | 'user';
export type TripStatus = 'active' | 'completed' | 'cancelled';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type NotificationType = 'booking' | 'message' | 'trip' | 'system';
export type TripRequestStatus = 'active' | 'matched' | 'cancelled' | 'expired';

export interface Profile {
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
  whatsapp_number: string | null;
  show_whatsapp: boolean;
  created_at: string;
}

export interface Trip {
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
  accepts_luggage: boolean;
  accepts_animals: boolean;
  is_recurring: boolean;
  recurrence_pattern: Json | null;
  return_trip_id: string | null;
  estimated_arrival_time: string | null;
  from_lat: number | null;
  from_lng: number | null;
  to_lat: number | null;
  to_lng: number | null;
  created_at: string;
}

export interface Booking {
  id: string;
  trip_id: string;
  passenger_id: string;
  status: BookingStatus;
  seats: number;
  message: string | null;
  is_private: boolean;
  total_price: number | null;
  platform_fee: number | null;
  driver_payout: number | null;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  trip_id: string | null;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: Json | null;
  read: boolean;
  created_at: string;
}

export interface Rating {
  id: string;
  trip_id: string;
  from_user_id: string;
  to_user_id: string;
  score: number;
  tags: string[] | null;
  comment: string | null;
  created_at: string;
}

export interface TripRequest {
  id: string;
  publisher_id: string;
  from_city: string;
  to_city: string;
  desired_date: string;
  desired_time: string | null;
  proposed_price: number | null;
  seats_needed: number;
  accepts_luggage: boolean;
  accepts_animals: boolean;
  is_private: boolean;
  status: TripRequestStatus;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  keys: Json;
  created_at: string;
}
