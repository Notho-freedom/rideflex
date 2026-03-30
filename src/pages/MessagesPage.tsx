import React, { useState } from 'react';
import { Search, ArrowLeft, Send, Phone } from 'lucide-react';
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

// Inline chat for desktop split view
function InlineChat({ navigate }: { navigate: (page: string) => void }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Bonjour, le point de rdv est bien devant la gare ?', sender: 'me', time: '10:15' },
    { id: 2, text: 'Bonjour ! Oui tout à fait, au niveau du dépose-minute.', sender: 'other', time: '10:20' },
    { id: 3, text: 'Parfait, on se retrouve devant la gare.', sender: 'other', time: '10:30' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sender: 'me', time: 'Maintenant' }]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <RFAvatar className="w-10 h-10 mr-3">
            <RFAvatarImage src="https://i.pravatar.cc/150?u=1" />
            <RFAvatarFallback>SM</RFAvatarFallback>
          </RFAvatar>
          <div>
            <h2 className="text-base font-bold text-foreground">Sophie M.</h2>
            <p className="text-xs text-brand-teal">En ligne</p>
          </div>
        </div>
        <button className="p-2 text-brand-blue bg-primary/10 rounded-full"><Phone className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="text-center text-xs text-muted-foreground my-4">Aujourd'hui</div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.sender === 'me' ? 'bg-gradient-brand text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <RFInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full bg-muted border-transparent focus-visible:ring-ring"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-primary-foreground shrink-0">
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MessagesPage({ navigate }: MessagesPageProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);

  const handleChatClick = (chatId: number) => {
    // On mobile, navigate to chat page. On desktop, select inline.
    if (window.innerWidth < 1024) {
      navigate('chat');
    } else {
      setSelectedChat(chatId);
    }
  };

  return (
    <div className="min-h-screen bg-card pb-20 lg:pb-0">
      {/* Desktop: split view */}
      <div className="hidden lg:flex h-screen">
        {/* Conversation list */}
        <div className="w-96 border-r border-border flex flex-col">
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <RFInput placeholder="Rechercher une conversation..." className="pl-10 bg-muted border-transparent focus-visible:ring-ring" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer transition-colors ${selectedChat === chat.id ? 'bg-primary/5 border-l-2 border-brand-blue' : 'hover:bg-muted'}`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <RFAvatar className="w-12 h-12 mr-3">
                  <RFAvatarImage src={`https://i.pravatar.cc/150?u=${chat.avatar}`} />
                  <RFAvatarFallback>{chat.name.charAt(0)}</RFAvatarFallback>
                </RFAvatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm font-semibold truncate ${chat.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{chat.name}</h3>
                    <span className={`text-xs ${chat.unread ? 'text-brand-blue font-semibold' : 'text-muted-foreground'}`}>{chat.time}</span>
                  </div>
                  <p className={`text-sm truncate ${chat.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{chat.message}</p>
                </div>
                {chat.unread > 0 && (
                  <RFBadge className="ml-2 bg-brand-blue hover:bg-brand-blue rounded-full w-6 h-6 flex items-center justify-center p-0 text-primary-foreground">{chat.unread}</RFBadge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <InlineChat navigate={navigate} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: list only */}
      <div className="lg:hidden">
        <div className="px-4 pt-12 pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <RFInput placeholder="Rechercher une conversation..." className="pl-10 bg-muted border-transparent focus-visible:ring-ring" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {conversations.map((chat) => (
            <div key={chat.id} className="flex items-center p-4 hover:bg-muted cursor-pointer transition-colors" onClick={() => handleChatClick(chat.id)}>
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
    </div>
  );
}
