import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/database';

type Booking = Database['public']['Tables']['bookings']['Row'];

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
    setBookings(data || []);
    setLoading(false);
  };

  const fetchBookingsForTrip = async (tripId: string) => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    return data || [];
  };

  const createBooking = async (tripId: string, seats: number = 1, message?: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('bookings')
      .insert({ trip_id: tripId, passenger_id: user.id, seats, message })
      .select()
      .single();
    return { data, error };
  };

  const updateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
    return { error };
  };

  return { bookings, loading, fetchMyBookings, fetchBookingsForTrip, createBooking, updateBookingStatus };
}
