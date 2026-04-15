import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

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

export function useRatings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createRating = async (rating: {
    trip_id: string;
    to_user_id: string;
    score: number;
    tags?: string[];
    comment?: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    const { data, error } = await supabase
      .from('ratings')
      .insert({ ...rating, from_user_id: user.id } as any)
      .select()
      .single();
    setLoading(false);
    return { data: data as Rating | null, error };
  };

  const getRatingsForUser = async (userId: string) => {
    const { data } = await supabase
      .from('ratings')
      .select('*')
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false });
    return (data as Rating[]) || [];
  };

  return { loading, createRating, getRatingsForUser };
}
