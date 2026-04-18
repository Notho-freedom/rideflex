import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  trip_id: string | null;
  content: string;
  read_at: string | null;
  created_at: string;
}

export function useMessages(otherUserId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) return;
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    setMessages((data as ChatMessage[]) || []);
    setLoading(false);
  }, [user, otherUserId]);

  useEffect(() => {
    if (!user || !otherUserId) return;
    fetchMessages();

    const channel = supabase
      .channel(`messages-${user.id}-${otherUserId}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMsg = payload.new as ChatMessage;
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
      .insert({ sender_id: user.id, receiver_id: otherUserId, content, trip_id: tripId } as any)
      .select()
      .single();
    return { data: data as ChatMessage | null, error };
  };

  return { messages, loading, sendMessage, fetchMessages };
}
