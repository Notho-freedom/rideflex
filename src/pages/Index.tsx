import React, { useState, useEffect, Component, type ReactNode } from 'react';
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
import { PublishRequestPage } from './PublishRequestPage';
import { TripRequestsPage } from './TripRequestsPage';
import { UserPublicProfilePage } from './UserPublicProfilePage';
import { useAuth } from '../contexts/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { RFButton } from '../components/rideflex/RFButton';

// ErrorBoundary to prevent full white screen crashes
class ErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Oups, une erreur est survenue</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">Nous sommes désolés. Cliquez ci-dessous pour revenir à l'accueil.</p>
          <RFButton variant="brand" onClick={() => { this.setState({ hasError: false, error: null }); this.props.onReset(); }}>
            Retour à l'accueil
          </RFButton>
        </div>
      );
    }
    return this.props.children;
  }
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const { user, loading } = useAuth();
  usePushNotifications();

  const navigate = (page: string, data?: any) => {
    if (page === 'notifications') {
      if (window.innerWidth >= 768) {
        setNotificationsOpen(true);
        return;
      }
    }
    setPageData(data || null);
    setCurrentPage(page);
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Auth guard
  const publicPages = ['auth', 'onboarding'];
  if (!loading && !user && !publicPages.includes(currentPage)) {
    return <AuthPage navigate={navigate} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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
      case 'trip-detail': return <TripDetailPage navigate={navigate} tripId={pageData?.tripId} />;
      case 'booking-confirmation': return <BookingConfirmation navigate={navigate} tripId={pageData?.tripId} seats={pageData?.seats} />;
      case 'chat': return <ChatPage navigate={navigate} otherUserId={pageData?.userId} otherUserName={pageData?.userName} />;
      case 'notifications': return <NotificationsPage navigate={navigate} />;
      case 'my-trips': return <MyTripsPage navigate={navigate} />;
      case 'edit-profile': return <EditProfilePage navigate={navigate} />;
      case 'settings': return <SettingsPage navigate={navigate} />;
      case 'rating': return <RatingPage navigate={navigate} tripId={pageData?.tripId} toUserId={pageData?.toUserId} toUserName={pageData?.toUserName} />;
      case 'payment-methods': return <PaymentMethodsPage navigate={navigate} />;
      case 'identity-verification': return <IdentityVerificationPage navigate={navigate} />;
      case 'booking-requests': return <BookingRequestsPage navigate={navigate} />;
      case 'publish-request': return <PublishRequestPage navigate={navigate} />;
      case 'trip-requests': return <TripRequestsPage navigate={navigate} />;
      case 'user-profile': return <UserPublicProfilePage navigate={navigate} userId={pageData?.userId} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  const noNavPages = ['auth', 'onboarding'];
  const showNav = !noNavPages.includes(currentPage);

  return (
    <ErrorBoundary onReset={() => { setCurrentPage('home'); setPageData(null); }}>
      <ResponsiveLayout currentPage={currentPage} navigate={navigate} showNav={showNav}>
        {renderPage()}
      </ResponsiveLayout>
      <NotificationsSheet
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        navigate={(page) => { setNotificationsOpen(false); setCurrentPage(page); }}
      />
    </ErrorBoundary>
  );
};

export default Index;
