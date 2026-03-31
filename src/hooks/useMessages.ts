import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

export function useMessages(otherUserId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) return;
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setLoading(false);
  }, [user, otherUserId]);

  // Realtime subscription
  useEffect(() => {
    if (!user || !otherUserId) return;

    fetchMessages();

    const channel = supabase
      .channel(`messages-${user.id}-${otherUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (
          (newMsg.sender_id === user.id && newMsg.receiver_id === otherUserId) ||
          (newMsg.sender_id === otherUserId && newMsg.receiver_id === user.id)
        ) {
          setMessages(prev => [...prev, newMsg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, otherUserId, fetchMessages]);

  const sendMessage = async (content: string, tripId?: string) => {
    if (!user || !otherUserId) return { error: 'Missing user or receiver' };
    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: user.id, receiver_id: otherUserId, content, trip_id: tripId })
      .select()
      .single();
    return { data, error };
  };

  return { messages, loading, sendMessage, fetchMessages };
}
