import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, MapPin, Radio, Briefcase, PawPrint, HandHelping, Map, List, Locate, Loader2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';
import { RFButton } from '../components/rideflex/RFButton';
import { MapboxSearch } from '../components/rideflex/MapboxSearch';
import { useUserMode } from '../contexts/UserModeContext';
import { supabase } from '../integrations/supabase/client';

interface SearchPageProps {
  navigate: (page: string, data?: any) => void;
}

type SearchMode = 'departure' | 'arrival' | 'trip';
type ViewMode = 'list' | 'map';

const modeLabels: Record<SearchMode, string> = { departure: 'Par départ', arrival: 'Par arrivée', trip: 'Par trajet' };
const radiusOptions = [5, 10, 15, 25, 50];

export function SearchPage({ navigate }: SearchPageProps) {
  const [mode, setMode] = useState<SearchMode>('trip');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [filterLuggage, setFilterLuggage] = useState(false);
  const [filterAnimals, setFilterAnimals] = useState(false);
  const [radius, setRadius] = useState(15);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDriver } = useUserMode();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    let query = supabase.from('trips').select('*, driver:profiles(full_name, avatar_url, rating_avg)').eq('status', 'active');
    if (fromSearch.trim()) query = query.ilike('from_city', `%${fromSearch}%`);
    if (toSearch.trim()) query = query.ilike('to_city', `%${toSearch}%`);
    if (filterLuggage) query = query.eq('accepts_luggage', true);
    if (filterAnimals) query = query.eq('accepts_animals', true);
    query = query.order('departure_date', { ascending: true }).limit(50);
    const { data } = await query;
    setTrips(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchTrips, 500);
    return () => clearTimeout(timer);
  }, [fromSearch, toSearch, filterLuggage, filterAnimals]);

  const mapTrips = trips.map(t => ({
    id: t.id,
    driver: t.driver?.full_name || 'Chauffeur',
    rating: t.driver?.rating_avg || 0,
    from: t.from_city,
    to: t.to_city,
    time: t.departure_time,
    price: t.price,
    seats: t.seats_available,
    type: 'planned',
    luggage: t.accepts_luggage,
    animals: t.accepts_animals,
    lat: t.from_lat || 45.5017,
    lng: t.from_lng || -73.5673,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm z-10">
        <div className="max-w-2xl lg:max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-lg font-bold text-foreground">{isDriver ? 'Demandes de passagers' : 'Recherche de chauffeurs'}</h1>
            <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
              {viewMode === 'list' ? <Map className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex bg-muted rounded-lg p-1 mb-4">
            {(Object.keys(modeLabels) as SearchMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>{modeLabels[m]}</button>
            ))}
          </div>
          <div className="space-y-3">
            {(mode === 'departure' || mode === 'trip') && (
              <div className="flex items-center bg-muted rounded-lg px-3 py-2">
                <MapPin className="text-primary w-5 h-5 mr-3 shrink-0" />
                <RFInput placeholder="Point de départ" value={fromSearch} onChange={(e) => setFromSearch(e.target.value)} className="border-0 focus-visible:ring-0 px-0 h-auto bg-transparent shadow-none" />
              </div>
            )}
            {(mode === 'arrival' || mode === 'trip') && (
              <div className="flex items-center bg-muted rounded-lg px-3 py-2">
                <MapPin className="text-secondary w-5 h-5 mr-3 shrink-0" />
                <RFInput placeholder="Point d'arrivée" value={toSearch} onChange={(e) => setToSearch(e.target.value)} className="border-0 focus-visible:ring-0 px-0 h-auto bg-transparent shadow-none" />
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setShowAvailableOnly(!showAvailableOnly)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${showAvailableOnly ? 'bg-secondary/15 text-secondary border border-secondary/30' : 'bg-muted text-muted-foreground'}`}>
              <Radio className="w-4 h-4" />Dispo maintenant
            </button>
            <button onClick={() => setFilterLuggage(!filterLuggage)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterLuggage ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'}`}>
              <Briefcase className="w-4 h-4" />Bagages
            </button>
            <button onClick={() => setFilterAnimals(!filterAnimals)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterAnimals ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'}`}>
              <PawPrint className="w-4 h-4" />Animaux
            </button>
            <button onClick={() => navigate('trip-requests')} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-all">
              <HandHelping className="w-4 h-4" />Demandes passagers
            </button>
            {viewMode === 'map' && (
              <div className="flex items-center gap-2 ml-auto">
                <Locate className="w-4 h-4 text-muted-foreground" />
                {radiusOptions.map(r => (
                  <button key={r} onClick={() => setRadius(r)} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${radius === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{r}km</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : viewMode === 'map' ? (
          <div className="h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)]">
            <MapboxSearch trips={mapTrips} radius={radius} onTripClick={(tripId) => navigate('trip-detail', { tripId })} className="h-full rounded-none" />
          </div>
        ) : (
          <div className="p-4">
            <div className="max-w-2xl lg:max-w-5xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">{trips.length} résultat{trips.length > 1 ? 's' : ''}</p>
              {trips.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>Aucun trajet trouvé.</p></div>}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <RFCard key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('trip-detail', { tripId: trip.id })}>
                    <RFCardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <RFAvatar><RFAvatarImage src={trip.driver?.avatar_url || `https://i.pravatar.cc/150?u=${trip.id}`} /><RFAvatarFallback>{(trip.driver?.full_name || 'U').charAt(0)}</RFAvatarFallback></RFAvatar>
                          <div>
                            <p className="font-semibold text-sm">{trip.driver?.full_name || 'Chauffeur'}</p>
                            <div className="flex items-center text-xs text-muted-foreground"><span className="text-yellow-500 mr-1">★</span> {trip.driver?.rating_avg?.toFixed(1) || '0.0'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-primary">{trip.price}€</span>
                          <p className="text-xs text-muted-foreground">{trip.seats_available} places</p>
                        </div>
                      </div>
                      <div className="relative pl-4 border-l-2 border-border space-y-4 ml-2">
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 bg-card border-2 border-primary rounded-full" />
                          <p className="text-sm font-semibold">{trip.departure_time}</p>
                          <p className="text-xs text-muted-foreground">{trip.from_city}</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 bg-secondary rounded-full" />
                          <p className="text-sm font-semibold">{trip.estimated_arrival_time || 'Arrivée'}</p>
                          <p className="text-xs text-muted-foreground">{trip.to_city}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {trip.accepts_luggage && <RFBadge variant="outline" className="text-muted-foreground"><Briefcase className="w-3 h-3 mr-1" />Bagages</RFBadge>}
                        {trip.accepts_animals && <RFBadge variant="outline" className="text-muted-foreground"><PawPrint className="w-3 h-3 mr-1" />Animaux</RFBadge>}
                      </div>
                    </RFCardContent>
                  </RFCard>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
