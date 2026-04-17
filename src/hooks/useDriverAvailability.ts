import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface DriverAvailability {
  user_id: string;
  is_available: boolean;
  lat: number | null;
  lng: number | null;
  radius_km: number;
  available_until: string | null;
  updated_at: string;
}

export function useDriverAvailability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<DriverAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from('driver_availability').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { setAvailability(data as DriverAvailability | null); setLoading(false); });
  }, [user]);

  const upsert = async (patch: Partial<DriverAvailability>) => {
    if (!user) return { error: 'Not authenticated' };
    const payload = { user_id: user.id, ...availability, ...patch } as any;
    const { data, error } = await supabase
      .from('driver_availability')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
    if (!error) setAvailability(data as DriverAvailability);
    return { error };
  };

  const fetchAvailableDrivers = async () => {
    const { data } = await supabase
      .from('driver_availability')
      .select('*, profiles!inner(id, full_name, avatar_url, rating_avg)')
      .eq('is_available', true);
    return data || [];
  };

  return { availability, loading, upsert, fetchAvailableDrivers };
}
