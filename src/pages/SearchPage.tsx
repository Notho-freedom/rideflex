import React, { useState } from 'react';
import { ArrowLeft, Filter, MapPin, Radio } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';

interface SearchPageProps {
  navigate: (page: string, data?: any) => void;
}

type SearchMode = 'departure' | 'arrival' | 'trip';

const trips = [
  { id: 1, driver: 'Sophie M.', rating: 4.9, from: 'Paris', to: 'Lyon', time: '14:30', price: 25, seats: 2, type: 'planned' },
  { id: 2, driver: 'Marc D.', rating: 4.7, from: 'Paris (Sud)', to: 'Lyon (Centre)', time: '16:00', price: 20, seats: 3, type: 'planned' },
  { id: 3, driver: 'Julie L.', rating: 5.0, from: 'Paris', to: 'Lyon', time: 'Immédiat', price: 35, seats: 1, type: 'available' },
];

const modeLabels: Record<SearchMode, string> = {
  departure: 'Par départ',
  arrival: 'Par arrivée',
  trip: 'Par trajet',
};

export function SearchPage({ navigate }: SearchPageProps) {
  const [mode, setMode] = useState<SearchMode>('trip');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredTrips = showAvailableOnly ? trips.filter(t => t.type === 'available') : trips;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm z-10">
        <div className="max-w-2xl lg:max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-lg font-bold text-foreground">Recherche</h1>
            <button className="p-2 -mr-2 text-muted-foreground"><Filter className="w-5 h-5" /></button>
          </div>

          {/* Search mode tabs */}
          <div className="flex bg-muted rounded-lg p-1 mb-4">
            {(Object.keys(modeLabels) as SearchMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>

          {/* Search inputs */}
          <div className="space-y-3">
            {(mode === 'departure' || mode === 'trip') && (
              <div className="flex items-center bg-muted rounded-lg px-3 py-2">
                <MapPin className="text-brand-blue w-5 h-5 mr-3 shrink-0" />
                <RFInput placeholder="Point de départ" className="border-0 focus-visible:ring-0 px-0 h-auto bg-transparent shadow-none" />
              </div>
            )}
            {(mode === 'arrival' || mode === 'trip') && (
              <div className="flex items-center bg-muted rounded-lg px-3 py-2">
                <MapPin className="text-brand-teal w-5 h-5 mr-3 shrink-0" />
                <RFInput placeholder="Point d'arrivée" className="border-0 focus-visible:ring-0 px-0 h-auto bg-transparent shadow-none" />
              </div>
            )}
          </div>

          {/* Available now filter */}
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              showAvailableOnly ? 'bg-secondary/15 text-brand-teal border border-brand-teal/30' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Radio className="w-4 h-4" />
            Chauffeur disponible maintenant
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl lg:max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4">{filteredTrips.length} résultat{filteredTrips.length > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => (
              <RFCard key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('trip-detail')}>
                <RFCardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <RFAvatar><RFAvatarImage src={`https://i.pravatar.cc/150?u=${trip.id}`} /><RFAvatarFallback>{trip.driver.charAt(0)}</RFAvatarFallback></RFAvatar>
                      <div>
                        <p className="font-semibold text-sm">{trip.driver}</p>
                        <div className="flex items-center text-xs text-muted-foreground"><span className="text-yellow-500 mr-1">★</span> {trip.rating}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-brand-blue">{trip.price}€</span>
                      <p className="text-xs text-muted-foreground">{trip.seats} places</p>
                    </div>
                  </div>
                  <div className="relative pl-4 border-l-2 border-border space-y-4 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 bg-card border-2 border-brand-blue rounded-full"></div>
                      <p className="text-sm font-semibold">{trip.time}</p>
                      <p className="text-xs text-muted-foreground">{trip.from}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 bg-brand-teal rounded-full"></div>
                      <p className="text-sm font-semibold">Arrivée estimée</p>
                      <p className="text-xs text-muted-foreground">{trip.to}</p>
                    </div>
                  </div>
                  {trip.type === 'available' && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <RFBadge variant="secondary" className="bg-secondary/10 text-brand-teal">
                        <Radio className="w-3 h-3 mr-1" />Disponible maintenant
                      </RFBadge>
                    </div>
                  )}
                </RFCardContent>
              </RFCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
