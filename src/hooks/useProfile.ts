import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

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
  created_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return; }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data as Profile | null);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id);
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    return { error };
  };

  return { profile, loading, updateProfile };
}
