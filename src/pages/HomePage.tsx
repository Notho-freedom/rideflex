import React from 'react';
import { MapPin, Calendar, Search, Car, Bell, UserCircle } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';

interface HomePageProps {
  navigate: (page: string, data?: any) => void;
}

export function HomePage({ navigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-brand pt-12 pb-28 px-4 rounded-b-[2rem] relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">RideFlex</h1>
          <div className="flex space-x-3">
            <button onClick={() => navigate('notifications')} className="p-2 bg-white/20 rounded-full text-primary-foreground hover:bg-white/30 transition">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('auth')} className="p-2 bg-white/20 rounded-full text-primary-foreground hover:bg-white/30 transition">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-primary-foreground/90 text-lg font-medium">Le covoiturage réinventé.</p>
        <p className="text-primary-foreground/80 text-sm mt-1">Trouvez votre trajet idéal aujourd'hui.</p>
      </div>

      {/* Search Card */}
      <div className="-mt-20 px-4 relative z-10">
        <RFCard className="shadow-xl border-0">
          <RFCardContent className="p-5 space-y-4">
            <div className="flex items-center border-b border-border pb-3">
              <MapPin className="text-brand-blue w-5 h-5 mr-3" />
              <RFInput placeholder="Lieu de départ" className="border-0 focus-visible:ring-0 px-0 h-auto text-base shadow-none" />
            </div>
            <div className="flex items-center border-b border-border pb-3">
              <MapPin className="text-brand-teal w-5 h-5 mr-3" />
              <RFInput placeholder="Lieu d'arrivée" className="border-0 focus-visible:ring-0 px-0 h-auto text-base shadow-none" />
            </div>
            <div className="flex items-center pb-2">
              <Calendar className="text-muted-foreground w-5 h-5 mr-3" />
              <RFInput type="date" className="border-0 focus-visible:ring-0 px-0 h-auto text-base text-muted-foreground shadow-none" />
            </div>
            <RFButton variant="brand" size="xl" className="w-full mt-2" onClick={() => navigate('search')}>
              Rechercher
            </RFButton>
          </RFCardContent>
        </RFCard>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-4">
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
                <Search className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-foreground">Mode Dispo</span>
            </RFCardContent>
          </RFCard>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Trajets récents</h2>
        <RFCard className="mb-4 cursor-pointer" onClick={() => navigate('trip-detail')}>
          <RFCardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <RFAvatar>
                  <RFAvatarImage src="https://i.pravatar.cc/150?u=1" />
                  <RFAvatarFallback>JD</RFAvatarFallback>
                </RFAvatar>
                <div>
                  <p className="font-semibold text-sm">Jean Dupont</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="text-yellow-500 mr-1">★</span> 4.8
                  </div>
                </div>
              </div>
              <span className="font-bold text-brand-blue text-lg">15€</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground space-x-2">
              <span className="font-medium text-foreground">Paris</span>
              <span>→</span>
              <span className="font-medium text-foreground">Lyon</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Aujourd'hui, 14:30</p>
          </RFCardContent>
        </RFCard>
      </div>
    </div>
  );
}
