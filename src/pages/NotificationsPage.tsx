import React from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Car } from 'lucide-react';

interface NotificationsPageProps {
  navigate: (page: string) => void;
}

const notifications = [
  { id: 1, title: 'Réservation confirmée', desc: 'Votre trajet Paris → Lyon est confirmé.', time: 'Il y a 10 min', icon: CheckCircle2, color: 'text-brand-teal', bg: 'bg-secondary/10' },
  { id: 2, title: 'Nouveau message', desc: 'Sophie M. vous a envoyé un message.', time: 'Il y a 1h', icon: MessageCircle, color: 'text-brand-blue', bg: 'bg-primary/10' },
  { id: 3, title: 'Nouveau trajet disponible', desc: 'Un trajet correspond à votre alerte Lyon → Marseille.', time: 'Hier', icon: Car, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export function NotificationsPage({ navigate }: NotificationsPageProps) {
  return (
    <div className="min-h-screen bg-card">
      <div className="px-4 pt-12 lg:pt-6 pb-4 border-b border-border">
        <div className="flex items-center max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Notifications</h1>
        </div>
      </div>

      <div className="max-w-2xl lg:max-w-4xl mx-auto divide-y divide-border">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div key={notif.id} className="flex items-start p-4 hover:bg-muted cursor-pointer">
              <div className={`p-3 rounded-full ${notif.bg} ${notif.color} mr-4 shrink-0`}><Icon className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{notif.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notif.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
