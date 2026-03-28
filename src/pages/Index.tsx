import React, { useState } from 'react';
import { BottomNav } from '../components/rideflex/BottomNav';
import { HomePage } from './HomePage';
import { SearchPage } from './SearchPage';
import { PublishPage } from './PublishPage';
import { MessagesPage } from './MessagesPage';
import { ProfilePage } from './ProfilePage';
import { AuthPage } from './AuthPage';
import { DriverDashboard } from './DriverDashboard';
import { TripDetailPage } from './TripDetailPage';
import { BookingConfirmation } from './BookingConfirmation';
import { ChatPage } from './ChatPage';
import { NotificationsPage } from './NotificationsPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page: string, data?: any) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'search': return <SearchPage navigate={navigate} />;
      case 'publish': return <PublishPage navigate={navigate} />;
      case 'messages': return <MessagesPage navigate={navigate} />;
      case 'profile': return <ProfilePage navigate={navigate} />;
      case 'auth': return <AuthPage navigate={navigate} />;
      case 'driver-dashboard': return <DriverDashboard navigate={navigate} />;
      case 'trip-detail': return <TripDetailPage navigate={navigate} />;
      case 'booking-confirmation': return <BookingConfirmation navigate={navigate} />;
      case 'chat': return <ChatPage navigate={navigate} />;
      case 'notifications': return <NotificationsPage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  const showBottomNav = ['home', 'search', 'publish', 'messages', 'profile'].includes(currentPage);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden font-sans">
      <main className="flex-1 overflow-y-auto relative">{renderPage()}</main>
      {showBottomNav && <BottomNav currentPage={currentPage} navigate={navigate} />}
    </div>
  );
};

export default Index;
