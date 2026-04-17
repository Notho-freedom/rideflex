import React, { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';
import { useConversations } from '../hooks/useConversations';
import { ChatPage } from './ChatPage';

interface MessagesPageProps {
  navigate: (page: string, data?: any) => void;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000 / 60 / 60;
  if (diff < 24) return d.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' });
  if (diff < 24 * 7) return d.toLocaleDateString('fr', { weekday: 'short' });
  return d.toLocaleDateString('fr', { day: '2-digit', month: '2-digit' });
}

export function MessagesPage({ navigate }: MessagesPageProps) {
  const { conversations, loading, markAsRead } = useConversations();
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => conversations.filter(c => c.otherUserName.toLowerCase().includes(search.toLowerCase())),
    [conversations, search]
  );

  const handleClick = (otherId: string, name: string) => {
    markAsRead(otherId);
    if (window.innerWidth < 1024) {
      navigate('chat', { userId: otherId, userName: name });
    } else {
      setSelected({ id: otherId, name });
    }
  };

  const renderRow = (c: typeof conversations[number], mobile: boolean) => (
    <div
      key={c.otherUserId}
      onClick={() => handleClick(c.otherUserId, c.otherUserName)}
      className={`flex items-center p-4 cursor-pointer transition-colors ${
        !mobile && selected?.id === c.otherUserId ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted'
      }`}
    >
      <RFAvatar className={`${mobile ? 'w-14 h-14 mr-4' : 'w-12 h-12 mr-3'}`}>
        <RFAvatarImage src={c.otherUserAvatar || undefined} />
        <RFAvatarFallback>{c.otherUserName.charAt(0) || '?'}</RFAvatarFallback>
      </RFAvatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={`${mobile ? 'text-base' : 'text-sm'} font-semibold truncate ${c.unreadCount ? 'text-foreground' : 'text-muted-foreground'}`}>
            {c.otherUserName || 'Utilisateur'}
          </h3>
          <span className={`text-xs ${c.unreadCount ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{formatTime(c.lastMessageAt)}</span>
        </div>
        <p className={`text-sm truncate ${c.unreadCount ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{c.lastMessage}</p>
      </div>
      {c.unreadCount > 0 && (
        <RFBadge className="ml-2 bg-primary hover:bg-primary rounded-full w-6 h-6 flex items-center justify-center p-0 text-primary-foreground">
          {c.unreadCount}
        </RFBadge>
      )}
    </div>
  );

  const emptyState = (
    <div className="text-center py-12 px-4 text-muted-foreground">
      <p className="font-medium">Aucune conversation</p>
      <p className="text-sm mt-1">Vos échanges avec les chauffeurs et passagers apparaîtront ici.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-card pb-20 lg:pb-0">
      {/* Desktop split */}
      <div className="hidden lg:flex h-screen">
        <div className="w-96 border-r border-border flex flex-col">
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <RFInput placeholder="Rechercher..." className="pl-10 bg-muted border-transparent" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loading ? <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
              : filtered.length === 0 ? emptyState
              : filtered.map(c => renderRow(c, false))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {selected ? (
            <ChatPage navigate={navigate} otherUserId={selected.id} otherUserName={selected.name} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="px-4 pt-12 pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <RFInput placeholder="Rechercher..." className="pl-10 bg-muted border-transparent" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="divide-y divide-border">
          {loading ? <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
            : filtered.length === 0 ? emptyState
            : filtered.map(c => renderRow(c, true))}
        </div>
      </div>
    </div>
  );
}
