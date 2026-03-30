import React from 'react';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';

interface ResponsiveLayoutProps {
  currentPage: string;
  navigate: (page: string) => void;
  children: React.ReactNode;
  showNav?: boolean;
}

export function ResponsiveLayout({ currentPage, navigate, children, showNav = true }: ResponsiveLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      {/* Desktop sidebar - always visible on lg+ */}
      {showNav && <SideNav currentPage={currentPage} navigate={navigate} />}

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto relative ${showNav ? 'lg:ml-64' : ''}`}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile/Tablet bottom nav */}
      {showNav && <BottomNav currentPage={currentPage} navigate={navigate} />}
    </div>
  );
}
