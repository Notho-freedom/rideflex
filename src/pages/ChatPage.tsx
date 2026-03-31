import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, MapPin } from 'lucide-react';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';

interface ChatPageProps {
  navigate: (page: string) => void;
}

// WhatsApp icon as inline SVG
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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

  const handleCall = () => {
    window.open('tel:+33612345678', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/33612345678', '_blank');
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setMessages([...messages, { id: Date.now(), text: `📍 Ma position : ${url}`, sender: 'me', time: 'Maintenant' }]);
      }, () => {
        setMessages([...messages, { id: Date.now(), text: '📍 Impossible d\'obtenir la position.', sender: 'me', time: 'Maintenant' }]);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-3xl lg:max-w-4xl mx-auto">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm flex items-center justify-between z-10">
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
        <div className="flex items-center gap-2">
          <button onClick={handleWhatsApp} className="p-2 text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors">
            <WhatsAppIcon className="w-5 h-5" />
          </button>
          <button onClick={handleCall} className="p-2 text-brand-blue bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="text-center text-xs text-muted-foreground my-4">Aujourd'hui</div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 ${msg.sender === 'me' ? 'bg-gradient-brand text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-4 border-t border-border pb-safe">
        <div className="flex items-center space-x-2">
          <button onClick={handleShareLocation} className="p-2 text-muted-foreground hover:text-brand-blue transition-colors shrink-0">
            <MapPin className="w-5 h-5" />
          </button>
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
