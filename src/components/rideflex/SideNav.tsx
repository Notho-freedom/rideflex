import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User, Car } from 'lucide-react';

interface SideNavProps {
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

export function SideNav({ currentPage, navigate }: SideNavProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-gradient-brand">RideFlex</h1>
        </div>
      </div>

      {/* Nav Items */}
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
                  ? 'bg-primary/10 text-brand-blue'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-blue' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-blue" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">RideFlex v1.0.0</p>
      </div>
    </aside>
  );
}
