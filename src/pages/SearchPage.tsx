import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, MapPin, Radio, Briefcase, PawPrint, HandHelping, Map, List, Locate, Loader2, Star, MessageCircle, Calendar, Euro, Users, ArrowUpDown } from 'lucide-react';
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
  initialFrom?: string;
  initialTo?: string;
}

type SearchMode = 'departure' | 'arrival' | 'trip';
type ViewMode = 'list' | 'map';
type SortMode = 'date' | 'price_asc' | 'price_desc' | 'rating';

const modeLabels: Record<SearchMode, string> = { departure: 'Par départ', arrival: 'Par arrivée', trip: 'Par trajet' };
const radiusOptions = [5, 10, 15, 25, 50];
const sortLabels: Record<SortMode, string> = { date: 'Date', price_asc: 'Prix ↑', price_desc: 'Prix ↓', rating: 'Note' };

function formatDateHuman(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

export function SearchPage({ navigate, initialFrom, initialTo }: SearchPageProps) {
  const [mode, setMode] = useState<SearchMode>('trip');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [filterLuggage, setFilterLuggage] = useState(false);
  const [filterAnimals, setFilterAnimals] = useState(false);
  const [radius, setRadius] = useState(15);
  const [fromSearch, setFromSearch] = useState(initialFrom || '');
  const [toSearch, setToSearch] = useState(initialTo || '');
  const [trips, setTrips] = useState<any[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const { isDriver } = useUserMode();

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSeats, setMinSeats] = useState('');
  const [sortBy, setSortBy] = useState<SortMode>('date');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    let query = supabase.from('trips').select('*, driver:profiles!trips_driver_id_fkey(full_name, avatar_url, rating_avg)').eq('status', 'active');
    if (fromSearch.trim()) query = query.ilike('from_city', `%${fromSearch}%`);
    if (toSearch.trim()) query = query.ilike('to_city', `%${toSearch}%`);
    if (filterLuggage) query = query.eq('accepts_luggage', true);
    if (filterAnimals) query = query.eq('accepts_animals', true);
    if (filterDate) query = query.eq('departure_date', filterDate);
    if (maxPrice) query = query.lte('price', Number(maxPrice));
    if (minSeats) query = query.gte('seats_available', Number(minSeats));

    // Sort
    if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('departure_date', { ascending: true });

    query = query.limit(50);
    const { data } = await query;
    let results = data || [];

    // Client-side sort by rating
    if (sortBy === 'rating') {
      results = results.sort((a: any, b: any) => (b.driver?.rating_avg || 0) - (a.driver?.rating_avg || 0));
    }

    setTrips(results);
    setLoading(false);
  };

  const fetchAvailableDrivers = async () => {
    setLoadingDrivers(true);
    const { data } = await supabase
      .from('driver_availability')
      .select('*, profile:profiles!driver_availability_user_id_fkey(full_name, avatar_url, rating_avg, vehicle_brand, vehicle_model, vehicle_color, total_trips)')
      .eq('is_available', true);
    setAvailableDrivers(data || []);
    setLoadingDrivers(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchTrips, 500);
    return () => clearTimeout(timer);
  }, [fromSearch, toSearch, filterLuggage, filterAnimals, filterDate, maxPrice, minSeats, sortBy]);

  useEffect(() => {
    if (showAvailableOnly) {
      fetchAvailableDrivers();
    } else {
      setAvailableDrivers([]);
    }
  }, [showAvailableOnly]);

  const activeFilterCount = [filterDate, maxPrice, minSeats].filter(Boolean).length + (sortBy !== 'date' ? 1 : 0);

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
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors relative ${showFilters ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <Filter className="w-5 h-5" />
                {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>}
              </button>
              <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                {viewMode === 'list' ? <Map className="w-5 h-5" /> : <List className="w-5 h-5" />}
              </button>
            </div>
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

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-muted/50 rounded-xl border border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Date</label>
                  <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1"><Euro className="w-3 h-3" />Prix max</label>
                  <RFInput type="number" placeholder="Ex: 25" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-9" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1"><Users className="w-3 h-3" />Places min</label>
                  <RFInput type="number" placeholder="1" min="1" max="8" value={minSeats} onChange={(e) => setMinSeats(e.target.value)} className="h-9" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1"><ArrowUpDown className="w-3 h-3" />Trier par</label>
                  <div className="flex flex-wrap gap-1">
                    {(Object.keys(sortLabels) as SortMode[]).map((s) => (
                      <button key={s} onClick={() => setSortBy(s)} className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${sortBy === s ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'}`}>{sortLabels[s]}</button>
                    ))}
                  </div>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={() => { setFilterDate(''); setMaxPrice(''); setMinSeats(''); setSortBy('date'); }} className="text-xs text-primary font-medium hover:underline">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

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
        {/* Available drivers section */}
        {showAvailableOnly && (
          <div className="p-4 border-b border-border">
            <div className="max-w-2xl lg:max-w-5xl mx-auto">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4" />Chauffeurs disponibles maintenant
              </h3>
              {loadingDrivers ? (
                <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-secondary" /></div>
              ) : availableDrivers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Radio className="w-8 h-8 text-secondary/40" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Aucun chauffeur disponible pour le moment.</p>
                  <p className="text-xs text-muted-foreground mt-1">Revenez plus tard ou recherchez des trajets planifiés.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableDrivers.map((da) => (
                    <RFCard key={da.user_id} className="cursor-pointer hover:shadow-md hover:border-secondary/30 transition-all" onClick={() => navigate('user-profile', { userId: da.user_id })}>
                      <RFCardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <RFAvatar className="w-12 h-12">
                              <RFAvatarImage src={da.profile?.avatar_url || `https://i.pravatar.cc/150?u=${da.user_id}`} />
                              <RFAvatarFallback>{(da.profile?.full_name || 'U').charAt(0)}</RFAvatarFallback>
                            </RFAvatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{da.profile?.full_name || 'Chauffeur'}</p>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{Number(da.profile?.rating_avg || 0).toFixed(1)}</span>
                              <span>• {da.profile?.total_trips || 0} trajets</span>
                            </div>
                            {da.profile?.vehicle_brand && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{da.profile.vehicle_brand} {da.profile.vehicle_model}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <RFBadge variant="outline" className="text-secondary text-xs"><Locate className="w-3 h-3 mr-1" />{da.radius_km}km</RFBadge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <RFButton variant="outline" size="sm" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); navigate('chat', { userId: da.user_id, userName: da.profile?.full_name }); }}>
                            <MessageCircle className="w-3.5 h-3.5 mr-1" />Contacter
                          </RFButton>
                        </div>
                      </RFCardContent>
                    </RFCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
              {trips.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-primary/30" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun trajet trouvé</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">Essayez de modifier vos critères de recherche ou élargissez votre zone.</p>
                  {activeFilterCount > 0 && (
                    <RFButton variant="outline" size="sm" className="mt-4" onClick={() => { setFilterDate(''); setMaxPrice(''); setMinSeats(''); setSortBy('date'); setFromSearch(''); setToSearch(''); }}>
                      Réinitialiser tout
                    </RFButton>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {trips.map((trip) => (
                    <RFCard key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('trip-detail', { tripId: trip.id })}>
                      <RFCardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <button
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); navigate('user-profile', { userId: trip.driver_id }); }}
                          >
                            <RFAvatar><RFAvatarImage src={trip.driver?.avatar_url || `https://i.pravatar.cc/150?u=${trip.id}`} /><RFAvatarFallback>{(trip.driver?.full_name || 'U').charAt(0)}</RFAvatarFallback></RFAvatar>
                            <div className="text-left">
                              <p className="font-semibold text-sm">{trip.driver?.full_name || 'Chauffeur'}</p>
                              <div className="flex items-center text-xs text-muted-foreground"><span className="text-yellow-500 mr-1">★</span> {trip.driver?.rating_avg?.toFixed(1) || '0.0'}</div>
                            </div>
                          </button>
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
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {trip.accepts_luggage && <RFBadge variant="outline" className="text-muted-foreground"><Briefcase className="w-3 h-3 mr-1" />Bagages</RFBadge>}
                            {trip.accepts_animals && <RFBadge variant="outline" className="text-muted-foreground"><PawPrint className="w-3 h-3 mr-1" />Animaux</RFBadge>}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDateHuman(trip.departure_date)}</span>
                        </div>
                      </RFCardContent>
                    </RFCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
