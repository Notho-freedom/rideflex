import React from 'react';
import { ArrowLeft, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFBadge } from '../components/rideflex/RFBadge';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';
import { RFButton } from '../components/rideflex/RFButton';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';

interface MyTripsPageProps {
  navigate: (page: string, data?: any) => void;
}

const upcomingTrips = [
  { id: 1, from: 'Paris', to: 'Lyon', date: '28 Mars 2026', time: '14:30', price: 25, status: 'confirmed', driver: 'Sophie M.', avatar: '1', seats: 1 },
  { id: 2, from: 'Lyon', to: 'Marseille', date: '2 Avril 2026', time: '09:00', price: 35, status: 'pending', driver: 'Marc D.', avatar: '2', seats: 2 },
];

const pastTrips = [
  { id: 3, from: 'Paris', to: 'Bordeaux', date: '15 Mars 2026', time: '08:00', price: 45, status: 'completed', driver: 'Julie L.', avatar: '3', seats: 1, rated: false },
  { id: 4, from: 'Lille', to: 'Paris', date: '10 Mars 2026', time: '16:30', price: 18, status: 'completed', driver: 'Thomas R.', avatar: '4', seats: 1, rated: true },
  { id: 5, from: 'Paris', to: 'Nantes', date: '5 Mars 2026', time: '07:00', price: 30, status: 'cancelled', driver: 'Emma B.', avatar: '5', seats: 1, rated: false },
];

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  confirmed: { label: 'Confirmé', className: 'bg-green-100 text-green-800 border-0', icon: CheckCircle2 },
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-0', icon: AlertCircle },
  completed: { label: 'Terminé', className: 'bg-muted text-muted-foreground border-0', icon: CheckCircle2 },
  cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800 border-0', icon: XCircle },
};

function TripCard({ trip, navigate, showRate }: { trip: any; navigate: (page: string) => void; showRate?: boolean }) {
  const status = statusConfig[trip.status];
  return (
    <RFCard className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('trip-detail')}>
      <RFCardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <RFBadge className={status.className}>{status.label}</RFBadge>
          <span className="font-bold text-brand-blue text-lg">{trip.price}€</span>
        </div>
        <div className="relative pl-4 border-l-2 border-border space-y-3 ml-2 mb-4">
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-card border-2 border-brand-blue rounded-full"></div>
            <p className="text-sm font-semibold">{trip.time} — {trip.from}</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-brand-teal rounded-full"></div>
            <p className="text-sm font-semibold">{trip.to}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RFAvatar className="w-8 h-8">
              <RFAvatarImage src={`https://i.pravatar.cc/150?u=${trip.avatar}`} />
              <RFAvatarFallback>{trip.driver.charAt(0)}</RFAvatarFallback>
            </RFAvatar>
            <div>
              <p className="text-sm font-medium">{trip.driver}</p>
              <p className="text-xs text-muted-foreground">{trip.date}</p>
            </div>
          </div>
          {showRate && !trip.rated && trip.status === 'completed' && (
            <RFButton variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate('rating'); }}>
              Noter
            </RFButton>
          )}
        </div>
      </RFCardContent>
    </RFCard>
  );
}

export function MyTripsPage({ navigate }: MyTripsPageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Mes trajets</h1>
        </div>
      </div>

      <RFTabs defaultValue="upcoming" className="w-full mt-4">
        <div className="px-4 max-w-2xl lg:max-w-4xl mx-auto">
          <RFTabsList className="w-full grid grid-cols-2">
            <RFTabsTrigger value="upcoming">À venir</RFTabsTrigger>
            <RFTabsTrigger value="past">Historique</RFTabsTrigger>
          </RFTabsList>
        </div>

        <RFTabsContent value="upcoming" className="p-4">
          <div className="max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} navigate={navigate} />
            ))}
          </div>
        </RFTabsContent>

        <RFTabsContent value="past" className="p-4">
          <div className="max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} navigate={navigate} showRate />
            ))}
          </div>
        </RFTabsContent>
      </RFTabs>
    </div>
  );
}
