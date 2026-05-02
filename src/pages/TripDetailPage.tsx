import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ShieldCheck, MessageCircle, Star, Info, Plus, Briefcase, PawPrint, Lock, Clock, Phone, Loader2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFInput } from '../components/rideflex/RFInput';
import { RFBadge } from '../components/rideflex/RFBadge';
import { MapboxMap } from '../components/rideflex/MapboxMap';
import { getRoute, type RouteResult } from '../lib/mapbox';
import { supabase } from '../integrations/supabase/client';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface TripDetailPageProps {
  navigate: (page: string, data?: any) => void;
  tripId?: string;
}

export function TripDetailPage({ navigate, tripId }: TripDetailPageProps) {
  const [showSuggestStop, setShowSuggestStop] = useState(false);
  const [bookPrivate, setBookPrivate] = useState(false);
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [trip, setTrip] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { createBooking } = useBookings();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId);
    } else {
      setLoading(false);
    }
  }, [tripId]);

  const loadTrip = async (id: string) => {
    setLoading(true);
    const { data: tripData } = await supabase.from('trips').select('*').eq('id', id).single();
    if (tripData) {
      setTrip(tripData);
      const { data: driverData } = await supabase.from('profiles').select('*').eq('id', tripData.driver_id).single();
      setDriver(driverData);

      if (tripData.from_lat && tripData.to_lat) {
        const stops = (tripData.stops as any[])?.map((s: any) => [s.lng, s.lat] as [number, number]) || [];
        const route = await getRoute([tripData.from_lng, tripData.from_lat], [tripData.to_lng, tripData.to_lat], stops);
        setRouteData(route);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!tripId && trip?.from_lat) {
      const stops = (trip.stops as any[])?.map((s: any) => [s.lng, s.lat] as [number, number]) || [];
      getRoute([trip.from_lng, trip.from_lat], [trip.to_lng, trip.to_lat], stops).then(r => setRouteData(r));
    }
  }, [trip]);

  const handleBook = async () => {
    if (!tripId) return;
    setBooking(true);
    const seats = bookPrivate ? trip.seats_available : 1;
    const { error } = await createBooking(tripId, seats, bookPrivate ? 'Réservation privée' : undefined);
    setBooking(false);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de réserver.', variant: 'destructive' });
    } else {
      toast({ title: 'Réservation envoyée !' });
      navigate('booking-confirmation', { tripId });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!trip) return null;

  const mapMarkers = [
    { lng: trip.from_lng || 2.3730, lat: trip.from_lat || 48.8448, color: 'hsl(214, 100%, 50%)' },
    ...((trip.stops as any[]) || []).map((s: any) => ({ lng: s.lng, lat: s.lat, color: 'hsl(214, 70%, 70%)' })),
    { lng: trip.to_lng || 4.8590, lat: trip.to_lat || 45.7602, color: 'hsl(168, 100%, 39%)' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between max-w-2xl lg:max-w-5xl mx-auto">
          <button onClick={() => navigate('search')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-foreground">Détails du trajet</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="max-w-2xl lg:max-w-5xl mx-auto lg:grid lg:grid-cols-5 lg:gap-6 lg:p-6">
          <div className="lg:col-span-3">
            <div className="bg-card p-6 mb-2 lg:rounded-xl lg:shadow-sm lg:mb-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{trip.departure_date || "Aujourd'hui"}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Arrivée estimée : <strong className="text-foreground">{trip.estimated_arrival_time || '—'}</strong></span>
                </div>
              </div>
              <div className="relative pl-6 border-l-2 border-border space-y-6 ml-2">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-card border-4 border-primary" />
                  <p className="text-lg font-bold text-foreground">{trip.departure_time}</p>
                  <p className="text-base font-medium text-foreground">{trip.from_city}</p>
                  <p className="text-sm text-muted-foreground mt-1">{trip.from_address || ''}</p>
                </div>
                {((trip.stops as any[]) || []).map((stop: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-card border-4 border-primary/50" />
                    <p className="text-base font-medium text-foreground">{stop.place || stop.city || 'Arrêt'}</p>
                    <span className="text-xs text-primary/70 font-medium">Arrêt intermédiaire</span>
                  </div>
                ))}
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-secondary" />
                  <p className="text-lg font-bold text-foreground">{trip.estimated_arrival_time || '—'}</p>
                  <p className="text-base font-medium text-foreground">{trip.to_city}</p>
                  <p className="text-sm text-muted-foreground mt-1">{trip.to_address || ''}</p>
                </div>
              </div>
              {!showSuggestStop ? (
                <button onClick={() => setShowSuggestStop(true)} className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  <Plus className="w-4 h-4" />Suggérer un arrêt
                </button>
              ) : (
                <div className="mt-4 p-3 border border-border rounded-lg space-y-3">
                  <p className="text-sm font-medium text-foreground">Suggérer un arrêt au chauffeur</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <RFInput placeholder="Lieu de l'arrêt suggéré" className="flex-1" />
                  </div>
                  <div className="flex gap-2">
                    <RFButton variant="outline" size="sm" onClick={() => setShowSuggestStop(false)}>Annuler</RFButton>
                    <RFButton variant="brand" size="sm" onClick={() => { toast({ title: 'Suggestion envoyée !' }); setShowSuggestStop(false); }}>Envoyer</RFButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card p-4 mb-2 lg:rounded-xl lg:shadow-sm lg:mb-0">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <RFAvatar className="w-14 h-14">
                    <RFAvatarImage src={driver?.avatar_url || `https://i.pravatar.cc/150?u=${trip.driver_id}`} />
                    <RFAvatarFallback>{driver?.full_name?.charAt(0) || 'U'}</RFAvatarFallback>
                  </RFAvatar>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{driver?.full_name || 'Chauffeur'}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="font-medium mr-1">{driver?.rating_avg?.toFixed(1) || '0.0'}</span>
                      <span>({driver?.total_trips || 0} trajets)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-primary/10 text-primary rounded-full" onClick={() => navigate('chat', { userId: trip.driver_id, userName: driver?.full_name })}>
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-secondary/10 text-secondary rounded-full">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <RFSeparator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center text-foreground"><ShieldCheck className="w-5 h-5 text-secondary mr-3" /><span className="text-sm">Identité vérifiée</span></div>
                {driver?.vehicle_brand && (
                  <div className="flex items-center text-foreground"><Info className="w-5 h-5 text-muted-foreground mr-3" /><span className="text-sm">{driver.vehicle_brand} {driver.vehicle_model} • {driver.vehicle_color}</span></div>
                )}
              </div>
            </div>

            <div className="bg-card p-4 lg:rounded-xl lg:shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Caractéristiques</h3>
              <div className="flex flex-wrap gap-2">
                {trip.accepts_luggage && <RFBadge variant="outline"><Briefcase className="w-3.5 h-3.5 mr-1" />Bagages acceptés</RFBadge>}
                {trip.accepts_animals ? (
                  <RFBadge variant="outline"><PawPrint className="w-3.5 h-3.5 mr-1" />Animaux acceptés</RFBadge>
                ) : (
                  <RFBadge variant="outline" className="text-muted-foreground/60"><PawPrint className="w-3.5 h-3.5 mr-1" />Pas d'animaux</RFBadge>
                )}
              </div>
            </div>

            <div className="bg-card p-4 lg:rounded-xl lg:shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Prix pour 1 place</span>
                <span className="text-2xl font-bold text-primary">{trip.price},00 €</span>
              </div>
              <p className="text-xs text-muted-foreground">{trip.seats_available} place{trip.seats_available > 1 ? 's' : ''} disponible{trip.seats_available > 1 ? 's' : ''}</p>
              <RFSeparator />
              <button
                onClick={() => setBookPrivate(!bookPrivate)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${bookPrivate ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-3">
                  <Lock className={`w-5 h-5 ${bookPrivate ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Réserver en privé</p>
                    <p className="text-xs text-muted-foreground">Toute la voiture pour vous</p>
                  </div>
                </div>
                <span className="font-bold text-foreground">{trip.price * trip.seats_total},00 €</span>
              </button>
            </div>

            <div className="hidden lg:block">
              <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={handleBook} disabled={booking}>
                {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : bookPrivate ? `Réserver en privé — ${trip.price * trip.seats_total}€` : 'Continuer'}
              </RFButton>
            </div>
          </div>

          <div className="lg:col-span-5 mt-2 lg:mt-0">
            <div className="bg-card lg:rounded-xl lg:shadow-sm overflow-hidden">
              <div className="h-64 lg:h-80">
                <MapboxMap
                  center={[trip.from_lng || 2.3730, trip.from_lat || 48.8448]}
                  zoom={6}
                  pitch={30}
                  bearing={0}
                  route={routeData?.geometry || null}
                  markers={mapMarkers}
                  show3DBuildings={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-safe z-50 lg:hidden">
        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={handleBook} disabled={booking}>
          {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : bookPrivate ? `Réserver en privé — ${trip.price * trip.seats_total}€` : 'Continuer'}
        </RFButton>
      </div>
    </div>
  );
}
