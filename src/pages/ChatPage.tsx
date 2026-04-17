import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Phone, MapPin } from 'lucide-react';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

interface ChatPageProps {
  navigate: (page: string) => void;
  otherUserId?: string;
  otherUserName?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ChatPage({ navigate, otherUserId, otherUserName }: ChatPageProps) {
  const { user } = useAuth();
  const targetUserId = otherUserId || '';
  const { messages: dbMessages, loading, sendMessage, fetchMessages } = useMessages(targetUserId);
  const [message, setMessage] = useState('');
  const [otherProfile, setOtherProfile] = useState<any>(null);

  useEffect(() => {
    if (!targetUserId) return;
    fetchMessages();
    supabase.from('profiles').select('id, full_name, avatar_url, phone, whatsapp_number, show_whatsapp').eq('id', targetUserId).maybeSingle()
      .then(({ data }) => setOtherProfile(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message.trim());
    setMessage('');
  };

  const handleCall = () => {
    if (otherProfile?.phone) window.open(`tel:${otherProfile.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const num = (otherProfile?.whatsapp_number || '').replace(/\D/g, '');
    if (num) window.open(`https://wa.me/${num}`, '_blank');
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        await sendMessage(`📍 Ma position : https://www.google.com/maps?q=${latitude},${longitude}`);
      });
    }
  };

  const displayName = otherUserName || otherProfile?.full_name || 'Conversation';
  const showWhatsApp = otherProfile?.show_whatsapp && otherProfile?.whatsapp_number;
  const showCall = !!otherProfile?.phone;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-3xl lg:max-w-4xl mx-auto">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('messages')} className="p-2 -ml-2 text-muted-foreground mr-2 lg:hidden"><ArrowLeft className="w-6 h-6" /></button>
          <RFAvatar className="w-10 h-10 mr-3">
            <RFAvatarImage src={otherProfile?.avatar_url || undefined} />
            <RFAvatarFallback>{displayName.charAt(0)}</RFAvatarFallback>
          </RFAvatar>
          <div>
            <h1 className="text-base font-bold text-foreground">{displayName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showWhatsApp && (
            <button onClick={handleWhatsApp} className="p-2 text-green-600 bg-green-50 rounded-full hover:bg-green-100">
              <WhatsAppIcon className="w-5 h-5" />
            </button>
          )}
          {showCall && (
            <button onClick={handleCall} className="p-2 text-primary bg-primary/10 rounded-full hover:bg-primary/20">
              <Phone className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {dbMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 ${msg.sender_id === user?.id ? 'bg-gradient-brand text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender_id === user?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {new Date(msg.created_at).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {dbMessages.length === 0 && !loading && (
          <div className="text-center text-muted-foreground text-sm py-8">Aucun message. Commencez la conversation !</div>
        )}
      </div>

      <div className="bg-card p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <button onClick={handleShareLocation} className="p-2 text-muted-foreground hover:text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </button>
          <RFInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full bg-muted border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
