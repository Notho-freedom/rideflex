import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../integrations/supabase/types';

type Trip = Database['public']['Tables']['trips']['Row'];
type TripInsert = Database['public']['Tables']['trips']['Insert'];

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async (filters?: {
    from_city?: string;
    to_city?: string;
    date?: string;
    available_now?: boolean;
  }) => {
    setLoading(true);
    let query = supabase.from('trips').select('*').eq('status', 'active');

    if (filters?.from_city) query = query.ilike('from_city', `%${filters.from_city}%`);
    if (filters?.to_city) query = query.ilike('to_city', `%${filters.to_city}%`);
    if (filters?.date) query = query.eq('departure_date', filters.date);

    query = query.order('departure_date', { ascending: true });

    const { data } = await query;
    setTrips(data || []);
    setLoading(false);
  };

  const createTrip = async (trip: Omit<TripInsert, 'driver_id'>) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('trips')
      .insert({ ...trip, driver_id: user.id })
      .select()
      .single();
    return { data, error };
  };

  const getMyTrips = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('driver_id', user.id)
      .order('created_at', { ascending: false });
    setTrips(data || []);
    setLoading(false);
  };

  return { trips, loading, fetchTrips, createTrip, getMyTrips };
}
