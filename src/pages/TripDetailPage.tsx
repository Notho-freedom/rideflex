import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ShieldCheck, MessageCircle, Star, Info, Plus, Briefcase, PawPrint, Lock, Clock, Phone } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFInput } from '../components/rideflex/RFInput';
import { RFBadge } from '../components/rideflex/RFBadge';
import { MapboxMap } from '../components/rideflex/MapboxMap';
import { getRoute, type RouteResult } from '../lib/mapbox';

interface TripDetailPageProps {
  navigate: (page: string, data?: any) => void;
}

export function TripDetailPage({ navigate }: TripDetailPageProps) {
  const [showSuggestStop, setShowSuggestStop] = useState(false);
  const [bookPrivate, setBookPrivate] = useState(false);
  const [routeData, setRouteData] = useState<RouteResult | null>(null);

  const stops = [
    { time: '14:30', place: 'Paris', detail: 'Gare de Lyon, Hall 1', type: 'departure', coords: [2.3730, 48.8448] as [number, number] },
    { time: '15:45', place: 'Fontainebleau', detail: 'Centre-ville', type: 'stop', coords: [2.7010, 48.4010] as [number, number] },
    { time: '18:00', place: 'Lyon', detail: 'Gare Part-Dieu', type: 'arrival', coords: [4.8590, 45.7602] as [number, number] },
  ];

  const tripFeatures = { luggage: true, animals: false, estimatedArrival: '18:00' };
  const pricePerSeat = 25;
  const totalSeats = 4;

  useEffect(() => {
    const from = stops[0].coords;
    const to = stops[stops.length - 1].coords;
    const mid = stops.filter(s => s.type === 'stop').map(s => s.coords);
    getRoute(from, to, mid).then(r => setRouteData(r));
  }, []);

  const mapMarkers = stops.map(s => ({
    lng: s.coords[0],
    lat: s.coords[1],
    color: s.type === 'departure' ? 'hsl(214, 100%, 50%)' : s.type === 'arrival' ? 'hsl(168, 100%, 39%)' : 'hsl(214, 70%, 70%)',
    label: s.type === 'stop' ? '•' : '',
    popup: `<strong>${s.place}</strong><br/><span style="color:#888">${s.detail}</span>`,
  }));

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
          {/* Left column — 3/5 */}
          <div className="lg:col-span-3">
            {/* Timeline */}
            <div className="bg-card p-6 mb-2 lg:rounded-xl lg:shadow-sm lg:mb-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Aujourd'hui</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Arrivée estimée : <strong className="text-foreground">{tripFeatures.estimatedArrival}</strong></span>
                </div>
              </div>
              <div className="relative pl-6 border-l-2 border-border space-y-6 ml-2">
                {stops.map((stop, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full ${
                      stop.type === 'departure' ? 'bg-card border-4 border-primary' :
                      stop.type === 'arrival' ? 'bg-secondary' :
                      'bg-card border-4 border-primary/50'
                    }`} />
                    <p className="text-lg font-bold text-foreground">{stop.time}</p>
                    <p className="text-base font-medium text-foreground">{stop.place}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stop.detail}</p>
                    {stop.type === 'stop' && (
                      <span className="text-xs text-primary/70 font-medium">Arrêt intermédiaire</span>
                    )}
                  </div>
                ))}
              </div>

              {!showSuggestStop ? (
                <button
                  onClick={() => setShowSuggestStop(true)}
                  className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                >
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
                    <RFButton variant="brand" size="sm" onClick={() => { alert('Suggestion envoyée !'); setShowSuggestStop(false); }}>Envoyer</RFButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column — 2/5 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Driver info */}
            <div className="bg-card p-4 mb-2 lg:rounded-xl lg:shadow-sm lg:mb-0">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <RFAvatar className="w-14 h-14">
                    <RFAvatarImage src="https://i.pravatar.cc/150?u=1" />
                    <RFAvatarFallback>SM</RFAvatarFallback>
                  </RFAvatar>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Sophie M.</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="font-medium mr-1">4.9</span><span>(42 avis)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-primary/10 text-primary rounded-full" onClick={() => navigate('chat')}>
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
                <div className="flex items-center text-foreground"><Info className="w-5 h-5 text-muted-foreground mr-3" /><span className="text-sm">Peugeot 208 • Blanche</span></div>
              </div>
            </div>

            {/* Features — moved from left */}
            <div className="bg-card p-4 lg:rounded-xl lg:shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Caractéristiques</h3>
              <div className="flex flex-wrap gap-2">
                {tripFeatures.luggage && (
                  <RFBadge variant="outline"><Briefcase className="w-3.5 h-3.5 mr-1" />Bagages acceptés</RFBadge>
                )}
                {tripFeatures.animals ? (
                  <RFBadge variant="outline"><PawPrint className="w-3.5 h-3.5 mr-1" />Animaux acceptés</RFBadge>
                ) : (
                  <RFBadge variant="outline" className="text-muted-foreground/60"><PawPrint className="w-3.5 h-3.5 mr-1" />Pas d'animaux</RFBadge>
                )}
              </div>
            </div>

            {/* Price + private — moved from left */}
            <div className="bg-card p-4 lg:rounded-xl lg:shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Prix pour 1 place</span>
                <span className="text-2xl font-bold text-primary">{pricePerSeat},00 €</span>
              </div>
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
                <span className="font-bold text-foreground">{pricePerSeat * totalSeats},00 €</span>
              </button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => navigate('booking-confirmation')}>
                {bookPrivate ? `Réserver en privé — ${pricePerSeat * totalSeats}€` : 'Continuer'}
              </RFButton>
            </div>
          </div>

          {/* Map — full width across both columns */}
          <div className="lg:col-span-5 mt-2 lg:mt-0">
            <div className="bg-card lg:rounded-xl lg:shadow-sm overflow-hidden">
              <div className="h-64 lg:h-80">
                <MapboxMap
                  center={[2.3730, 48.8448]}
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
        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => navigate('booking-confirmation')}>
          {bookPrivate ? `Réserver en privé — ${pricePerSeat * totalSeats}€` : 'Continuer'}
        </RFButton>
      </div>
    </div>
  );
}
