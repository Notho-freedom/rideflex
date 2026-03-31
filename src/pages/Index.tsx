import React, { useState } from 'react';
import { ResponsiveLayout } from '../components/rideflex/ResponsiveLayout';
import { HomePage } from './HomePage';
import { SearchPage } from './SearchPage';
import { PublishPage } from './PublishPage';
import { MessagesPage } from './MessagesPage';
import { ProfilePage } from './ProfilePage';
import { AuthPage } from './AuthPage';
import { OnboardingPage } from './OnboardingPage';
import { DriverDashboard } from './DriverDashboard';
import { TripDetailPage } from './TripDetailPage';
import { BookingConfirmation } from './BookingConfirmation';
import { ChatPage } from './ChatPage';
import { NotificationsPage } from './NotificationsPage';
import { MyTripsPage } from './MyTripsPage';
import { EditProfilePage } from './EditProfilePage';
import { SettingsPage } from './SettingsPage';
import { RatingPage } from './RatingPage';
import { PaymentMethodsPage } from './PaymentMethodsPage';
import { IdentityVerificationPage } from './IdentityVerificationPage';
import { BookingRequestsPage } from './BookingRequestsPage';
import { NotificationsSheet } from '../components/rideflex/NotificationsSheet';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigate = (page: string, data?: any) => {
    if (page === 'notifications') {
      // On desktop/tablet: open sheet. On mobile: navigate to page.
      if (window.innerWidth >= 768) {
        setNotificationsOpen(true);
        return;
      }
    }
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
      case 'onboarding': return <OnboardingPage navigate={navigate} />;
      case 'driver-dashboard': return <DriverDashboard navigate={navigate} />;
      case 'trip-detail': return <TripDetailPage navigate={navigate} />;
      case 'booking-confirmation': return <BookingConfirmation navigate={navigate} />;
      case 'chat': return <ChatPage navigate={navigate} />;
      case 'notifications': return <NotificationsPage navigate={navigate} />;
      case 'my-trips': return <MyTripsPage navigate={navigate} />;
      case 'edit-profile': return <EditProfilePage navigate={navigate} />;
      case 'settings': return <SettingsPage navigate={navigate} />;
      case 'rating': return <RatingPage navigate={navigate} />;
      case 'payment-methods': return <PaymentMethodsPage navigate={navigate} />;
      case 'identity-verification': return <IdentityVerificationPage navigate={navigate} />;
      case 'booking-requests': return <BookingRequestsPage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  // Pages without nav: auth, onboarding, booking-confirmation (confirmed state), rating (submitted state)
  const noNavPages = ['auth', 'onboarding'];
  const showNav = !noNavPages.includes(currentPage);

  return (
    <>
      <ResponsiveLayout currentPage={currentPage} navigate={navigate} showNav={showNav}>
        {renderPage()}
      </ResponsiveLayout>
      <NotificationsSheet
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        navigate={(page) => { setNotificationsOpen(false); setCurrentPage(page); }}
      />
    </>
  );
};

export default Index;
