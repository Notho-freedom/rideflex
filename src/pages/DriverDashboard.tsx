import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Settings, Radio, Loader2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent, RFCardHeader, RFCardTitle } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { MapboxMap } from '../components/rideflex/MapboxMap';
import { useDriverAvailability } from '../hooks/useDriverAvailability';
import { useToast } from '../hooks/use-toast';

interface DriverDashboardProps {
  navigate: (page: string, data?: any) => void;
}

export function DriverDashboard({ navigate }: DriverDashboardProps) {
  const { availability, loading, upsert } = useDriverAvailability();
  const { toast } = useToast();
  const [radius, setRadius] = useState(10);
  const [until, setUntil] = useState('18:00');
  const [userPos, setUserPos] = useState<[number, number]>([-73.5673, 45.5017]);
  const isAvailable = availability?.is_available ?? false;

  useEffect(() => {
    if (availability) {
      setRadius(availability.radius_km || 10);
      if (availability.lat && availability.lng) setUserPos([availability.lng, availability.lat]);
      if (availability.available_until) setUntil(new Date(availability.available_until).toTimeString().slice(0, 5));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.longitude, pos.coords.latitude]),
      () => {}
    );
  }, [availability]);

  const activate = async () => {
    const [h, m] = until.split(':').map(Number);
    const untilDate = new Date();
    untilDate.setHours(h || 18, m || 0, 0, 0);
    const { error } = await upsert({
      is_available: true,
      lat: userPos[1], lng: userPos[0],
      radius_km: radius,
      available_until: untilDate.toISOString(),
    });
    if (error) toast({ title: 'Erreur', description: String(error), variant: 'destructive' });
    else toast({ title: 'Mode dispo activé', description: 'Vous êtes visible par les passagers.' });
  };

  const deactivate = async () => {
    await upsert({ is_available: false });
    toast({ title: 'Mode dispo désactivé' });
  };

  const updateRadius = async (val: number) => {
    setRadius(val);
    if (isAvailable) await upsert({ radius_km: val });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl lg:max-w-5xl mx-auto">
          <div className="flex items-center">
            <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-xl font-bold text-foreground ml-2">Mode Disponible</h1>
          </div>
          <RFButton variant="outline" size="sm" onClick={() => navigate('booking-requests')}>Demandes</RFButton>
        </div>
      </div>

      <div className="p-4 max-w-2xl lg:max-w-5xl mx-auto lg:grid lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3 mb-6 lg:mb-0">
          <RFCard className="h-72 lg:h-full lg:min-h-[450px] overflow-hidden border-0 shadow-lg">
            <RFCardContent className="p-0 h-full relative">
              {loading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
              ) : !isAvailable ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex flex-col items-center justify-center z-10">
                  <div className="absolute w-48 h-48 rounded-full border-2 border-primary/10 animate-pulse" />
                  <Radio className="w-16 h-16 text-primary/40 mb-4" />
                  <RFButton variant="brand" size="xl" className="shadow-xl px-8" onClick={activate}>
                    <Radio className="w-5 h-5 mr-2" />Activer le mode dispo
                  </RFButton>
                </div>
              ) : (
                <div className="h-full relative">
                  <MapboxMap
                    center={userPos}
                    zoom={13}
                    pitch={50}
                    bearing={-17.6}
                    radiusKm={radius}
                    radiusCenter={userPos}
                    markers={[{ lng: userPos[0], lat: userPos[1], color: 'hsl(168, 100%, 39%)', label: '📍' }]}
                    show3DBuildings={true}
                  />
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm z-10">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-xs font-semibold text-secondary">En ligne</span>
                  </div>
                  <button onClick={deactivate} className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-destructive shadow-sm hover:bg-card z-10">
                    Désactiver
                  </button>
                </div>
              )}
            </RFCardContent>
          </RFCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <RFCard>
            <RFCardHeader className="pb-3">
              <RFCardTitle className="text-base flex items-center">
                <Settings className="w-4 h-4 mr-2 text-muted-foreground" />Paramètres
              </RFCardTitle>
            </RFCardHeader>
            <RFCardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Rayon d'acceptation</label>
                  <span className="font-bold text-primary">{radius} km</span>
                </div>
                <input type="range" min="1" max="100" value={radius} onChange={(e) => updateRadius(Number(e.target.value))} className="w-full accent-[hsl(214,100%,50%)]" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span><span>50 km</span><span>100 km</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Disponible jusqu'à</label>
                <div className="flex items-center space-x-2">
                  <Clock className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput type="time" value={until} onChange={(e) => setUntil(e.target.value)} className="flex-1" />
                </div>
              </div>
            </RFCardContent>
          </RFCard>
        </div>
      </div>
    </div>
  );
}
