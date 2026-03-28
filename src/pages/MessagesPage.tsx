import React from 'react';
import { Search } from 'lucide-react';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';

interface MessagesPageProps {
  navigate: (page: string, data?: any) => void;
}

const conversations = [
  { id: 1, name: 'Sophie M.', message: 'Parfait, on se retrouve devant la gare.', time: '10:30', unread: 2, avatar: '1' },
  { id: 2, name: 'Marc D.', message: 'Avez-vous de la place pour une valise ?', time: 'Hier', unread: 0, avatar: '2' },
  { id: 3, name: 'Julie L.', message: 'Merci pour le trajet !', time: 'Lun', unread: 0, avatar: '3' },
];

export function MessagesPage({ navigate }: MessagesPageProps) {
  return (
    <div className="min-h-screen bg-card pb-20">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <RFInput placeholder="Rechercher une conversation..." className="pl-10 bg-muted border-transparent focus-visible:ring-ring" />
        </div>
      </div>

      <div className="divide-y divide-border">
        {conversations.map((chat) => (
          <div key={chat.id} className="flex items-center p-4 hover:bg-muted cursor-pointer transition-colors" onClick={() => navigate('chat')}>
            <RFAvatar className="w-14 h-14 mr-4">
              <RFAvatarImage src={`https://i.pravatar.cc/150?u=${chat.avatar}`} />
              <RFAvatarFallback>{chat.name.charAt(0)}</RFAvatarFallback>
            </RFAvatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`text-base font-semibold truncate ${chat.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{chat.name}</h3>
                <span className={`text-xs ${chat.unread ? 'text-brand-blue font-semibold' : 'text-muted-foreground'}`}>{chat.time}</span>
              </div>
              <p className={`text-sm truncate ${chat.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{chat.message}</p>
            </div>
            {chat.unread > 0 && (
              <RFBadge className="ml-3 bg-brand-blue hover:bg-brand-blue rounded-full w-6 h-6 flex items-center justify-center p-0 text-primary-foreground">{chat.unread}</RFBadge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
