import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface Booking {
  id: string;
  trip_id: string;
  passenger_id: string;
  status: string;
  seats: number;
  message: string | null;
  created_at: string;
}

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('passenger_id', user.id)
      .order('created_at', { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  const fetchBookingsForTrip = async (tripId: string) => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    return (data as Booking[]) || [];
  };

  const createBooking = async (tripId: string, seats: number = 1, message?: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('bookings')
      .insert({ trip_id: tripId, passenger_id: user.id, seats, message } as any)
      .select()
      .single();
    return { data: data as Booking | null, error };
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status } as any)
      .eq('id', bookingId);
    return { error };
  };

  return { bookings, loading, fetchMyBookings, fetchBookingsForTrip, createBooking, updateBookingStatus };
}
