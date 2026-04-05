import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User, Car, HandHelping } from 'lucide-react';
import { useUserMode } from '../../contexts/UserModeContext';

interface BottomNavProps {
  currentPage: string;
  navigate: (page: string) => void;
}

export function BottomNav({ currentPage, navigate }: BottomNavProps) {
  const { isDriver } = useUserMode();

  const passengerTabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'publish-request', label: 'Demande', icon: HandHelping },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const driverTabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'publish', label: 'Publier', icon: Car },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const tabs = isDriver ? driverTabs : passengerTabs;
  const activeColor = isDriver ? 'text-secondary' : 'text-primary';

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
                className={`w-6 h-6 ${isActive ? activeColor : 'text-muted-foreground'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? activeColor : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
