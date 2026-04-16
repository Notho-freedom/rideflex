import React from 'react';
import { CheckCircle2, MessageCircle, Car } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function NotificationsSheet({ open, onOpenChange, navigate }: NotificationsSheetProps) {
  const { notifications, markAsRead } = useNotifications();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-lg font-bold">Notifications</SheetTitle>
        </SheetHeader>
        <div className="divide-y divide-border overflow-y-auto max-h-[calc(100vh-80px)]">
          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">Aucune notification.</div>
          )}
          {notifications.map((notif) => {
            const Icon = iconMap[notif.type] || CheckCircle2;
            const colors = colorMap[notif.type] || colorMap.system;
            return (
              <button
                key={notif.id}
                className={`flex items-start p-4 hover:bg-muted cursor-pointer w-full text-left transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                onClick={() => { markAsRead(notif.id); navigate('notifications'); }}
              >
                <div className={`p-3 rounded-full ${colors.bg} ${colors.color} mr-4 shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-bold ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(notif.created_at).toLocaleDateString('fr', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.body}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
