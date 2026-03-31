import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface Trip {
  id: string;
  driver_id: string;
  from_city: string;
  from_address: string | null;
  to_city: string;
  to_address: string | null;
  stops: any;
  departure_date: string;
  departure_time: string;
  price: number;
  seats_total: number;
  seats_available: number;
  status: string;
  created_at: string;
}

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async (filters?: {
    from_city?: string;
    to_city?: string;
    date?: string;
  }) => {
    setLoading(true);
    let query = supabase.from('trips').select('*').eq('status', 'active');
    if (filters?.from_city) query = query.ilike('from_city', `%${filters.from_city}%`);
    if (filters?.to_city) query = query.ilike('to_city', `%${filters.to_city}%`);
    if (filters?.date) query = query.eq('departure_date', filters.date);
    query = query.order('departure_date', { ascending: true });
    const { data } = await query;
    setTrips((data as Trip[]) || []);
    setLoading(false);
  };

  const createTrip = async (trip: Omit<Trip, 'id' | 'driver_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('trips')
      .insert({ ...trip, driver_id: user.id } as any)
      .select()
      .single();
    return { data: data as Trip | null, error };
  };

  const getMyTrips = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('driver_id', user.id)
      .order('created_at', { ascending: false });
    setTrips((data as Trip[]) || []);
    setLoading(false);
  };

  return { trips, loading, fetchTrips, createTrip, getMyTrips };
}
