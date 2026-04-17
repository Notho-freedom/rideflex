import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface PaymentMethod {
  id: string;
  user_id: string;
  brand: string;
  last4: string;
  expiry: string;
  is_default: boolean;
  created_at: string;
}

export function usePaymentMethods() {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMethods = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('payment_methods').select('*').eq('user_id', user.id)
      .order('is_default', { ascending: false }).order('created_at', { ascending: false });
    setMethods((data as PaymentMethod[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchMethods(); }, [fetchMethods]);

  const addMethod = async (m: { brand: string; last4: string; expiry: string; is_default?: boolean }) => {
    if (!user) return { error: 'Not authenticated' };
    if (m.is_default) {
      await supabase.from('payment_methods').update({ is_default: false } as any).eq('user_id', user.id);
    }
    const { error } = await supabase.from('payment_methods')
      .insert({ ...m, user_id: user.id, is_default: m.is_default ?? methods.length === 0 } as any);
    if (!error) fetchMethods();
    return { error };
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    await supabase.from('payment_methods').update({ is_default: false } as any).eq('user_id', user.id);
    await supabase.from('payment_methods').update({ is_default: true } as any).eq('id', id);
    fetchMethods();
  };

  const deleteMethod = async (id: string) => {
    await supabase.from('payment_methods').delete().eq('id', id);
    fetchMethods();
  };

  return { methods, loading, addMethod, setDefault, deleteMethod };
}
