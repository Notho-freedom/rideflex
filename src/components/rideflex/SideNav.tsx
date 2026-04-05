import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User, Car, HandHelping } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useUserMode } from '../../contexts/UserModeContext';

interface SideNavProps {
  currentPage: string;
  navigate: (page: string) => void;
}

export function SideNav({ currentPage, navigate }: SideNavProps) {
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
  const accentColor = isDriver ? 'text-secondary' : 'text-primary';
  const dotColor = isDriver ? 'bg-secondary' : 'bg-primary';
  const activeBg = isDriver ? 'bg-secondary/10' : 'bg-primary/10';

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen fixed left-0 top-0 z-40">
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <img src={logoImg} alt="RideFlex" className="w-9 h-9 rounded-xl object-contain" />
          <h1 className="text-xl font-bold text-gradient-brand">RideFlex</h1>
        </div>
        <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${accentColor}`}>
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          {isDriver ? 'Mode Chauffeur' : 'Mode Passager'}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? `${activeBg} ${accentColor}`
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? accentColor : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
              {isActive && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${dotColor}`} />}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">© 2026 RideFlex v1.0.0</p>
      </div>
    </aside>
  );
}
