import React, { useState } from 'react';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';

interface ChatPageProps {
  navigate: (page: string) => void;
}

export function ChatPage({ navigate }: ChatPageProps) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('messages')} className="p-2 -ml-2 text-muted-foreground mr-2"><ArrowLeft className="w-6 h-6" /></button>
          <RFAvatar className="w-10 h-10 mr-3">
            <RFAvatarImage src="https://i.pravatar.cc/150?u=1" />
            <RFAvatarFallback>SM</RFAvatarFallback>
          </RFAvatar>
          <div>
            <h1 className="text-base font-bold text-foreground">Sophie M.</h1>
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

      <div className="bg-card p-4 border-t border-border pb-safe">
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
