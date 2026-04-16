import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Car, Loader2 } from 'lucide-react';
import { useNotifications as useAppNotifications } from '../hooks/useNotifications';

interface NotificationsPageProps {
  navigate: (page: string) => void;
}

const iconMap: Record<string, any> = {
  booking: CheckCircle2,
  message: MessageCircle,
  trip: Car,
  system: CheckCircle2,
};

const colorMap: Record<string, { color: string; bg: string }> = {
  booking: { color: 'text-secondary', bg: 'bg-secondary/10' },
  message: { color: 'text-primary', bg: 'bg-primary/10' },
  trip: { color: 'text-purple-500', bg: 'bg-purple-50' },
  system: { color: 'text-muted-foreground', bg: 'bg-muted' },
};

export function NotificationsPage({ navigate }: NotificationsPageProps) {
  const { notifications, loading, markAsRead, markAllAsRead } = useAppNotifications();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-card">
      <div className="px-4 pt-12 lg:pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between max-w-2xl lg:max-w-4xl mx-auto">
          <div className="flex items-center">
            <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-xl font-bold text-foreground ml-2">Notifications</h1>
          </div>
          {notifications.length > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-primary font-medium">Tout marquer lu</button>
          )}
        </div>
      </div>

      <div className="max-w-2xl lg:max-w-4xl mx-auto divide-y divide-border">
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground"><p>Aucune notification.</p></div>
        )}
        {notifications.map((notif) => {
          const Icon = iconMap[notif.type] || CheckCircle2;
          const colors = colorMap[notif.type] || colorMap.system;
          return (
            <div
              key={notif.id}
              className={`flex items-start p-4 hover:bg-muted cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className={`p-3 rounded-full ${colors.bg} ${colors.color} mr-4 shrink-0`}><Icon className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {new Date(notif.created_at).toLocaleDateString('fr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notif.body}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 ml-2 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
