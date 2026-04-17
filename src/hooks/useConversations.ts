import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface Conversation {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: msgs } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, content, created_at, read_at')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!msgs) { setConversations([]); setLoading(false); return; }

    const map = new Map<string, Conversation>();
    for (const m of msgs as any[]) {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!map.has(otherId)) {
        map.set(otherId, {
          otherUserId: otherId,
          otherUserName: '',
          otherUserAvatar: null,
          lastMessage: m.content,
          lastMessageAt: m.created_at,
          unreadCount: 0,
        });
      }
      if (m.receiver_id === user.id && !m.read_at) {
        const c = map.get(otherId)!;
        c.unreadCount += 1;
      }
    }

    const otherIds = Array.from(map.keys());
    if (otherIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', otherIds);
      for (const p of (profiles || []) as any[]) {
        const c = map.get(p.id);
        if (c) {
          c.otherUserName = p.full_name || 'Utilisateur';
          c.otherUserAvatar = p.avatar_url;
        }
      }
    }

    setConversations(Array.from(map.values()));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) { setConversations([]); setLoading(false); return; }
    fetchConversations();

    const channel = supabase
      .channel('conversations-' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  const markAsRead = async (otherUserId: string) => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', user.id)
      .is('read_at', null);
    fetchConversations();
  };

  return { conversations, loading, fetchConversations, markAsRead };
}
