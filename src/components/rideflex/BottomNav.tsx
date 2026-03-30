import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  navigate: (page: string) => void;
}

const tabs = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'search', label: 'Recherche', icon: Search },
  { id: 'publish', label: 'Publier', icon: PlusCircle },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profile', label: 'Profil', icon: User },
];

export function BottomNav({ currentPage, navigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe z-50 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-brand-blue' : 'text-muted-foreground'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-gradient-brand' : 'text-muted-foreground'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
