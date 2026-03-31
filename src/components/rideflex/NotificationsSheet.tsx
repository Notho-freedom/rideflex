import React from 'react';
import { CheckCircle2, MessageCircle, Car } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigate: (page: string) => void;
}

const notifications = [
  { id: 1, title: 'Réservation confirmée', desc: 'Votre trajet Paris → Lyon est confirmé.', time: 'Il y a 10 min', icon: CheckCircle2, color: 'text-brand-teal', bg: 'bg-secondary/10', target: 'my-trips' },
  { id: 2, title: 'Nouveau message', desc: 'Sophie M. vous a envoyé un message.', time: 'Il y a 1h', icon: MessageCircle, color: 'text-brand-blue', bg: 'bg-primary/10', target: 'chat' },
  { id: 3, title: 'Nouveau trajet disponible', desc: 'Un trajet correspond à votre alerte Lyon → Marseille.', time: 'Hier', icon: Car, color: 'text-purple-500', bg: 'bg-purple-50', target: 'search' },
];

export function NotificationsSheet({ open, onOpenChange, navigate }: NotificationsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-lg font-bold">Notifications</SheetTitle>
        </SheetHeader>
        <div className="divide-y divide-border overflow-y-auto max-h-[calc(100vh-80px)]">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <button
                key={notif.id}
                className="flex items-start p-4 hover:bg-muted cursor-pointer w-full text-left transition-colors"
                onClick={() => navigate(notif.target)}
              >
                <div className={`p-3 rounded-full ${notif.bg} ${notif.color} mr-4 shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{notif.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
