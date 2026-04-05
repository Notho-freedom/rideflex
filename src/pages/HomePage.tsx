import React from 'react';
import { MapPin, Calendar, Car, Bell, UserCircle, Radio, ClipboardList, MoreHorizontal, HandHelping, Search } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { LocationPicker } from '../components/rideflex/LocationPicker';
import { useUserMode } from '../contexts/UserModeContext';

interface HomePageProps {
  navigate: (page: string, data?: any) => void;
}

export function HomePage({ navigate }: HomePageProps) {
  const [departure, setDeparture] = React.useState('');
  const [arrival, setArrival] = React.useState('');
  const { mode, isDriver, isPassenger } = useUserMode();

  // Mode-specific quick actions
  const passengerActions = [
    { label: 'Publier une demande', icon: HandHelping, page: 'publish-request', color: 'primary' },
    { label: 'Chauffeurs dispo', icon: Radio, page: 'search', color: 'primary' },
    { label: 'Mes trajets', icon: MapPin, page: 'my-trips', color: 'primary' },
    { label: 'Mes réservations', icon: ClipboardList, page: 'booking-requests', color: 'primary' },
  ];

  const driverActions = [
    { label: 'Publier un trajet', icon: Car, page: 'publish', color: 'secondary' },
    { label: 'Mode Dispo', icon: Radio, page: 'driver-dashboard', color: 'secondary' },
    { label: 'Mes réservations', icon: ClipboardList, page: 'booking-requests', color: 'secondary' },
    { label: 'Demandes passagers', icon: HandHelping, page: 'trip-requests', color: 'secondary' },
    { label: 'Mes trajets', icon: MapPin, page: 'my-trips', color: 'secondary' },
  ];

  const quickActions = isDriver ? driverActions : passengerActions;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Hero */}
      <div className={`${isDriver ? 'bg-gradient-to-br from-secondary via-secondary/90 to-primary' : 'bg-gradient-brand'} pt-12 lg:pt-8 pb-28 lg:pb-24 px-4 rounded-b-[2rem] relative overflow-hidden`}>
        <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground tracking-tight lg:hidden">RideFlex</h1>
              <h1 className="text-3xl font-bold text-primary-foreground tracking-tight hidden lg:block">Bienvenue sur RideFlex</h1>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isDriver ? 'bg-white/20 text-primary-foreground' : 'bg-white/20 text-primary-foreground'}`}>
                {isDriver ? '🚗 Mode Chauffeur' : '👤 Mode Passager'}
              </span>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => navigate('notifications')} className="p-2 bg-white/20 rounded-full text-primary-foreground hover:bg-white/30 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-transparent" />
              </button>
              <button onClick={() => navigate('profile')} className="p-2 bg-white/20 rounded-full text-primary-foreground hover:bg-white/30 transition">
                <UserCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-primary-foreground/90 text-lg font-medium">
            {isDriver ? 'Rentabilisez vos trajets.' : 'Le covoiturage réinventé.'}
          </p>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {isDriver ? 'Publiez et trouvez des passagers.' : 'Trouvez votre trajet idéal aujourd\'hui.'}
          </p>
        </div>
      </div>

      {/* Search Card */}
      <div className="-mt-20 px-4 relative z-10 max-w-2xl lg:max-w-4xl mx-auto">
        <RFCard className="shadow-xl border-0">
          <RFCardContent className="p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center border-b md:border-b-0 md:border-r border-border pb-3 md:pb-0 md:pr-4">
                <LocationPicker value={departure} onChange={setDeparture} placeholder="Lieu de départ" icon="departure" otherValue={arrival} />
              </div>
              <div className="flex items-center border-b md:border-b-0 md:border-r border-border pb-3 md:pb-0 md:pr-4">
                <LocationPicker value={arrival} onChange={setArrival} placeholder="Lieu d'arrivée" icon="arrival" otherValue={departure} />
              </div>
              <div className="flex items-center pb-3 md:pb-0">
                <Calendar className="text-muted-foreground w-5 h-5 mr-3 shrink-0" />
                <input type="date" className="flex-1 bg-transparent text-sm text-muted-foreground outline-none" />
              </div>
              <RFButton variant="brand" size="xl" className="w-full" onClick={() => navigate('search')}>
                <Search className="w-4 h-4 mr-2" />Rechercher
              </RFButton>
            </div>
          </RFCardContent>
        </RFCard>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-8 max-w-2xl lg:max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">Actions rapides</h2>
        <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(quickActions.length, 5)} gap-4`}>
          {quickActions.map((action, i) => (
            <RFCard
              key={i}
              className={`cursor-pointer transition-colors ${action.color === 'secondary' ? 'hover:border-secondary' : 'hover:border-primary'}`}
              onClick={() => navigate(action.page)}
            >
              <RFCardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  action.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                }`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm text-foreground">{action.label}</span>
              </RFCardContent>
            </RFCard>
          ))}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="px-4 mt-8 max-w-2xl lg:max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {isDriver ? 'Dernières demandes' : 'Trajets récents'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Jean Dupont', initials: 'JD', from: 'Montréal', to: 'Ottawa', price: 35, rating: 4.8, time: "Aujourd'hui, 14:30", avatar: '1' },
            { name: 'Sophie Martin', initials: 'SM', from: 'Montréal', to: 'Cornwall', price: 22, rating: 4.9, time: 'Demain, 09:00', avatar: '2', hideMobile: true },
            { name: 'Marc Dubois', initials: 'MD', from: 'Ottawa', to: 'Toronto', price: 45, rating: 4.7, time: '10 Avril, 07:00', avatar: '5', hideTablet: true },
          ].map((trip, i) => (
            <RFCard
              key={i}
              className={`cursor-pointer ${trip.hideMobile ? 'hidden md:block' : ''} ${trip.hideTablet ? 'hidden lg:block' : ''}`}
              onClick={() => navigate('trip-detail')}
            >
              <RFCardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <RFAvatar>
                      <RFAvatarImage src={`https://i.pravatar.cc/150?u=${trip.avatar}`} />
                      <RFAvatarFallback>{trip.initials}</RFAvatarFallback>
                    </RFAvatar>
                    <div>
                      <p className="font-semibold text-sm">{trip.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="text-yellow-500 mr-1">★</span> {trip.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-primary text-lg">{trip.price}$</span>
                    <button className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground space-x-2">
                  <span className="font-medium text-foreground">{trip.from}</span>
                  <span>→</span>
                  <span className="font-medium text-foreground">{trip.to}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{trip.time}</p>
              </RFCardContent>
            </RFCard>
          ))}
        </div>
      </div>
    </div>
  );
}
