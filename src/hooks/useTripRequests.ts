import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

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
  status: string;
  created_at: string;
  publisher?: { full_name: string | null; avatar_url: string | null; rating_avg: number };
}

export function useTripRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('trip_requests')
      .select('*, publisher:profiles!trip_requests_publisher_id_fkey(full_name, avatar_url, rating_avg)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setRequests((data as TripRequest[]) || []);
    setLoading(false);
  };

  const fetchMyRequests = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('trip_requests')
      .select('*')
      .eq('publisher_id', user.id)
      .order('created_at', { ascending: false });
    setRequests((data as TripRequest[]) || []);
    setLoading(false);
  };

  const createRequest = async (request: {
    from_city: string;
    to_city: string;
    desired_date: string;
    desired_time?: string;
    proposed_price?: number;
    seats_needed?: number;
    accepts_luggage?: boolean;
    accepts_animals?: boolean;
    is_private?: boolean;
  }) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('trip_requests')
      .insert({ ...request, publisher_id: user.id } as any)
      .select()
      .single();
    return { data: data as TripRequest | null, error };
  };

  return { requests, loading, fetchActiveRequests, fetchMyRequests, createRequest };
}
