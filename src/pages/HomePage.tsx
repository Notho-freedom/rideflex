import React from 'react';
import { MapPin, Calendar, Car, Bell, UserCircle, Radio, ClipboardList, MoreHorizontal } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';

interface HomePageProps {
  navigate: (page: string, data?: any) => void;
}

export function HomePage({ navigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-brand pt-12 lg:pt-8 pb-28 lg:pb-24 px-4 rounded-b-[2rem] relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary-foreground tracking-tight lg:hidden">RideFlex</h1>
            <h1 className="text-3xl font-bold text-primary-foreground tracking-tight hidden lg:block">Bienvenue sur RideFlex</h1>
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
          <p className="text-primary-foreground/90 text-lg font-medium">Le covoiturage réinventé.</p>
          <p className="text-primary-foreground/80 text-sm mt-1">Trouvez votre trajet idéal aujourd'hui.</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="-mt-20 px-4 relative z-10 max-w-2xl lg:max-w-4xl mx-auto">
        <RFCard className="shadow-xl border-0">
          <RFCardContent className="p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center border-b md:border-b-0 md:border-r border-border pb-3 md:pb-0 md:pr-4">
                <MapPin className="text-brand-blue w-5 h-5 mr-3 shrink-0" />
                <RFInput placeholder="Lieu de départ" className="border-0 focus-visible:ring-0 px-0 h-auto text-base shadow-none" />
              </div>
              <div className="flex items-center border-b md:border-b-0 md:border-r border-border pb-3 md:pb-0 md:pr-4">
                <MapPin className="text-brand-teal w-5 h-5 mr-3 shrink-0" />
                <RFInput placeholder="Lieu d'arrivée" className="border-0 focus-visible:ring-0 px-0 h-auto text-base shadow-none" />
              </div>
              <div className="flex items-center pb-3 md:pb-0">
                <Calendar className="text-muted-foreground w-5 h-5 mr-3 shrink-0" />
                <RFInput type="date" className="border-0 focus-visible:ring-0 px-0 h-auto text-base text-muted-foreground shadow-none" />
              </div>
              <RFButton variant="brand" size="xl" className="w-full" onClick={() => navigate('search')}>
                Rechercher
              </RFButton>
            </div>
          </RFCardContent>
        </RFCard>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-8 max-w-2xl lg:max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <RFCard className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate('publish')}>
            <RFCardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-brand-blue">
                <Car className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-foreground">Publier un trajet</span>
            </RFCardContent>
          </RFCard>
          <RFCard className="cursor-pointer hover:border-secondary transition-colors" onClick={() => navigate('driver-dashboard')}>
            <RFCardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-brand-teal">
                <Radio className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-foreground">Mode Dispo</span>
            </RFCardContent>
          </RFCard>
          <RFCard className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate('my-trips')}>
            <RFCardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-brand-blue">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-foreground">Mes trajets</span>
            </RFCardContent>
          </RFCard>
          <RFCard className="cursor-pointer hover:border-secondary transition-colors" onClick={() => navigate('booking-requests')}>
            <RFCardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-brand-teal">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-foreground">Mes réservations</span>
            </RFCardContent>
          </RFCard>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="px-4 mt-8 max-w-2xl lg:max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">Trajets récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Jean Dupont', initials: 'JD', from: 'Paris', to: 'Lyon', price: 15, rating: 4.8, time: "Aujourd'hui, 14:30", avatar: '1' },
            { name: 'Sophie Martin', initials: 'SM', from: 'Lyon', to: 'Marseille', price: 22, rating: 4.9, time: 'Demain, 09:00', avatar: '2', hideMobile: true },
            { name: 'Marc Dubois', initials: 'MD', from: 'Paris', to: 'Bordeaux', price: 30, rating: 4.7, time: '30 Mars, 07:00', avatar: '5', hideTablet: true },
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
                    <span className="font-bold text-brand-blue text-lg">{trip.price}€</span>
                    <button
                      className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
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
