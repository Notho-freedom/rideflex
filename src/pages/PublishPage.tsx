import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Euro, Plus, X, Briefcase, PawPrint, RotateCcw, Repeat } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFSwitch } from '../components/rideflex/RFSwitch';
import { MapboxMap } from '../components/rideflex/MapboxMap';
import { geocode, getRoute, type RouteResult } from '../lib/mapbox';

interface PublishPageProps {
  navigate: (page: string) => void;
}

export function PublishPage({ navigate }: PublishPageProps) {
  const [stops, setStops] = useState<string[]>([]);
  const [seats, setSeats] = useState(3);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [acceptsLuggage, setAcceptsLuggage] = useState(true);
  const [acceptsAnimals, setAcceptsAnimals] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [mapMarkers, setMapMarkers] = useState<Array<{ lng: number; lat: number; color?: string }>>([]);

  const addStop = () => setStops([...stops, '']);
  const removeStop = (index: number) => setStops(stops.filter((_, i) => i !== index));
  const updateStop = (index: number, value: string) => {
    const updated = [...stops];
    updated[index] = value;
    setStops(updated);
  };

  const toggleSeat = (seat: number) => {
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Auto-calculate route when departure/arrival change
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!departure.trim() || !arrival.trim()) return;
      try {
        const [fromResults, toResults] = await Promise.all([geocode(departure), geocode(arrival)]);
        if (!fromResults.length || !toResults.length) return;
        const from = fromResults[0].center;
        const to = toResults[0].center;

        const stopCoords: [number, number][] = [];
        for (const s of stops) {
          if (s.trim()) {
            const r = await geocode(s);
            if (r.length) stopCoords.push(r[0].center);
          }
        }

        const markers = [
          { lng: from[0], lat: from[1], color: 'hsl(214, 100%, 50%)' },
          ...stopCoords.map(c => ({ lng: c[0], lat: c[1], color: 'hsl(214, 70%, 70%)' })),
          { lng: to[0], lat: to[1], color: 'hsl(168, 100%, 39%)' },
        ];
        setMapMarkers(markers);

        const route = await getRoute(from, to, stopCoords);
        setRouteData(route);
      } catch { /* ignore */ }
    }, 800);
    return () => clearTimeout(timer);
  }, [departure, arrival, stops]);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-xl lg:max-w-5xl mx-auto">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Publier un trajet</h1>
        </div>
      </div>

      <div className="p-4 max-w-xl lg:max-w-5xl mx-auto">
        {/* 2-col form on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Col 1: Itinéraire + Date */}
          <RFCard>
            <RFCardContent className="p-5 space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Itinéraire</h2>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-primary w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <RFInput
                      placeholder="Lieu de départ exact"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                    />
                  </div>
                </div>

                {stops.map((stop, i) => (
                  <div key={i} className="flex items-center space-x-3 ml-2 pl-3 border-l-2 border-dashed border-primary/30">
                    <MapPin className="text-primary/50 w-4 h-4 shrink-0" />
                    <div className="flex-1">
                      <RFInput placeholder={`Arrêt ${i + 1}`} value={stop} onChange={(e) => updateStop(i, e.target.value)} />
                    </div>
                    <button onClick={() => removeStop(i)} className="p-1 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                  </div>
                ))}

                <button onClick={addStop} className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors ml-8">
                  <Plus className="w-4 h-4" />Ajouter un arrêt
                </button>

                <div className="flex items-center space-x-3">
                  <MapPin className="text-secondary w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <RFInput
                      placeholder="Lieu d'arrivée exact"
                      value={arrival}
                      onChange={(e) => setArrival(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <RFSeparator />

              <div className="space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Date et Heure</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-muted-foreground w-5 h-5 shrink-0" />
                    <RFInput type="date" className="text-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="text-muted-foreground w-5 h-5 shrink-0" />
                    <RFInput type="time" className="text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Aller-retour</span>
                  </div>
                  <RFSwitch checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
                </div>

                {isRoundTrip && (
                  <div className="pl-8 space-y-3 border-l-2 border-dashed border-secondary/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Retour</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-muted-foreground w-4 h-4 shrink-0" />
                        <RFInput type="date" className="text-muted-foreground" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="text-muted-foreground w-4 h-4 shrink-0" />
                        <RFInput type="time" className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Repeat className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Trajet régulier</span>
                  </div>
                  <RFSwitch checked={isRecurring} onCheckedChange={setIsRecurring} />
                </div>

                {isRecurring && (
                  <div className="pl-8 space-y-3 border-l-2 border-dashed border-primary/30">
                    <div className="flex bg-muted rounded-lg p-1">
                      {(['daily', 'weekly', 'monthly'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setRecurrenceType(t)}
                          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${recurrenceType === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                        >
                          {t === 'daily' ? 'Quotidien' : t === 'weekly' ? 'Hebdo' : 'Mensuel'}
                        </button>
                      ))}
                    </div>
                    {recurrenceType === 'weekly' && (
                      <div className="flex gap-2 flex-wrap">
                        {days.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => toggleDay(i)}
                            className={`w-10 h-10 rounded-lg text-xs font-semibold transition-all ${selectedDays.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </RFCardContent>
          </RFCard>

          {/* Col 2: Détails + Sièges */}
          <div className="space-y-6 mt-6 lg:mt-0">
            <RFCard>
              <RFCardContent className="p-5 space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Détails</h2>
                <div className="flex items-center space-x-3">
                  <Users className="text-muted-foreground w-5 h-5 shrink-0" />
                  <div className="flex-1 flex items-center justify-between border border-border rounded-md px-3 py-2">
                    <span className="text-sm text-muted-foreground">Places disponibles</span>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setSeats(Math.max(1, seats - 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">-</button>
                      <span className="font-semibold">{seats}</span>
                      <button onClick={() => setSeats(Math.min(7, seats + 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">+</button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Euro className="text-muted-foreground w-5 h-5 shrink-0" />
                  <div className="flex-1 relative">
                    <RFInput type="number" placeholder="Prix par passager" className="pl-3 pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Bagages acceptés</span>
                  </div>
                  <RFSwitch checked={acceptsLuggage} onCheckedChange={setAcceptsLuggage} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PawPrint className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Animaux acceptés</span>
                  </div>
                  <RFSwitch checked={acceptsAnimals} onCheckedChange={setAcceptsAnimals} />
                </div>
              </RFCardContent>
            </RFCard>

            {/* Seat Schema */}
            <RFCard>
              <RFCardContent className="p-5">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Configuration des sièges</h2>
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-3 w-fit">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/50 border-2 border-muted cursor-not-allowed">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="w-14 h-14" />
                    <button onClick={() => toggleSeat(1)} className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all ${selectedSeats.includes(1) ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/50'}`}>
                      <span className="text-xs font-bold">1</span>
                    </button>
                    {[2, 3, 4].map((seat) => (
                      <button key={seat} onClick={() => toggleSeat(seat)} className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all ${selectedSeats.includes(seat) ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/50'}`}>
                        <span className="text-xs font-bold">{seat}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">Cliquez pour sélectionner/désélectionner les sièges</p>
              </RFCardContent>
            </RFCard>
          </div>
        </div>

        {/* Map — full width below both columns */}
        <div className="mt-6">
          <RFCard className="overflow-hidden">
            <RFCardContent className="p-0">
              <div className="h-64 lg:h-80">
                <MapboxMap
                  center={routeData ? undefined : [-73.5673, 45.5017]}
                  zoom={routeData ? undefined : 5}
                  pitch={30}
                  bearing={0}
                  route={routeData?.geometry || null}
                  markers={mapMarkers}
                  show3DBuildings={false}
                />
              </div>
            </RFCardContent>
          </RFCard>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => { alert('Trajet publié avec succès !'); navigate('home'); }}>
            Publier mon trajet
          </RFButton>
        </div>
      </div>
    </div>
  );
}
