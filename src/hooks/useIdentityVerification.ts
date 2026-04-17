import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export type IdDocType = 'id_card' | 'selfie' | 'license' | 'phone';
export type IdDocStatus = 'pending' | 'verified' | 'rejected';

export interface IdentityDocument {
  id: string;
  user_id: string;
  type: IdDocType;
  status: IdDocStatus;
  file_url: string | null;
  created_at: string;
}

export function useIdentityVerification() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<IdentityDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('identity_documents').select('*').eq('user_id', user.id);
    setDocs((data as IdentityDocument[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const uploadDocument = async (type: IdDocType, file: File) => {
    if (!user) return { error: 'Not authenticated' };
    const path = `${user.id}/${type}-${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from('identity-docs').upload(path, file, { upsert: true });
    if (upErr) return { error: upErr.message };

    const { error } = await supabase.from('identity_documents').upsert({
      user_id: user.id, type, file_url: path, status: 'pending',
    } as any, { onConflict: 'user_id,type' });
    if (!error) fetchDocs();
    return { error };
  };

  const setPhoneVerified = async () => {
    if (!user) return;
    await supabase.from('identity_documents').upsert({
      user_id: user.id, type: 'phone', status: 'verified',
    } as any, { onConflict: 'user_id,type' });
    fetchDocs();
  };

  return { docs, loading, uploadDocument, setPhoneVerified };
}
