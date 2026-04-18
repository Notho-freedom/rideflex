import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFBadge } from '../components/rideflex/RFBadge';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';
import { RFButton } from '../components/rideflex/RFButton';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useUserMode } from '../contexts/UserModeContext';
import { useToast } from '../hooks/use-toast';

interface MyTripsPageProps {
  navigate: (page: string, data?: any) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-0' },
  accepted: { label: 'Confirmé', className: 'bg-green-100 text-green-800 border-0' },
  rejected: { label: 'Refusé', className: 'bg-red-100 text-red-800 border-0' },
  cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800 border-0' },
  active: { label: 'À venir', className: 'bg-primary/10 text-primary border-0' },
  completed: { label: 'Terminé', className: 'bg-muted text-muted-foreground border-0' },
};

export function MyTripsPage({ navigate }: MyTripsPageProps) {
  const { user } = useAuth();
  const { isDriver } = useUserMode();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    if (isDriver) {
      const { data } = await supabase.from('trips').select('*').eq('driver_id', user.id).order('departure_date', { ascending: false });
      setItems((data || []).map((t: any) => ({ kind: 'trip', ...t })));
    } else {
      const { data } = await supabase
        .from('bookings')
        .select('*, trips(*, driver:profiles!trips_driver_id_fkey(id, full_name, avatar_url))')
        .eq('passenger_id', user.id)
        .order('created_at', { ascending: false });
      setItems((data || []).map((b: any) => ({ kind: 'booking', ...b })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user, isDriver]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = items.filter(i => {
    const d = i.kind === 'trip' ? i.departure_date : i.trips?.departure_date;
    return d && d >= today && i.status !== 'cancelled' && i.status !== 'rejected';
  });
  const past = items.filter(i => !upcoming.includes(i));

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' } as any).eq('id', bookingId);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Réservation annulée' }); load(); }
  };

  const cancelTrip = async (tripId: string) => {
    const { error } = await supabase.from('trips').update({ status: 'cancelled' } as any).eq('id', tripId);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Trajet annulé' }); load(); }
  };

  const renderCard = (item: any) => {
    const isBooking = item.kind === 'booking';
    const trip = isBooking ? item.trips : item;
    if (!trip) return null;
    const driver = isBooking ? (trip as any).driver : null;
    const status = statusConfig[item.status] || statusConfig.active;
    const isUpcoming = trip.departure_date >= today && item.status !== 'cancelled' && item.status !== 'rejected';

    return (
      <RFCard key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('trip-detail', { tripId: trip.id })}>
        <RFCardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <RFBadge className={status.className}>{status.label}</RFBadge>
            <span className="font-bold text-primary text-lg">{trip.price}€</span>
          </div>
          <div className="relative pl-4 border-l-2 border-border space-y-3 ml-2 mb-4">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 bg-card border-2 border-primary rounded-full"></div>
              <p className="text-sm font-semibold">{trip.departure_time?.slice(0, 5)} — {trip.from_city}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 bg-secondary rounded-full"></div>
              <p className="text-sm font-semibold">{trip.to_city}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {driver && (
                <RFAvatar className="w-8 h-8">
                  <RFAvatarImage src={driver.avatar_url || undefined} />
                  <RFAvatarFallback>{driver.full_name?.charAt(0) || '?'}</RFAvatarFallback>
                </RFAvatar>
              )}
              <div>
                {driver && <p className="text-sm font-medium">{driver.full_name}</p>}
                <p className="text-xs text-muted-foreground">{trip.departure_date}</p>
              </div>
            </div>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {isUpcoming && (
                <RFButton variant="outline" size="sm" className="text-destructive border-destructive/30"
                  onClick={() => isBooking ? cancelBooking(item.id) : cancelTrip(trip.id)}>
                  Annuler
                </RFButton>
              )}
              {!isUpcoming && isBooking && item.status === 'accepted' && driver && (
                <RFButton variant="outline" size="sm"
                  onClick={() => navigate('rating', { tripId: trip.id, toUserId: driver.id, toUserName: driver.full_name })}>
                  Noter
                </RFButton>
              )}
            </div>
          </div>
        </RFCardContent>
      </RFCard>
    );
  };

  const emptyState = (msg: string) => (
    <div className="text-center py-12 col-span-full">
      <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground font-medium">{msg}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">{isDriver ? 'Mes trajets publiés' : 'Mes trajets'}</h1>
        </div>
      </div>

      <RFTabs defaultValue="upcoming" className="w-full mt-4">
        <div className="px-4 max-w-2xl lg:max-w-4xl mx-auto">
          <RFTabsList className="w-full grid grid-cols-2">
            <RFTabsTrigger value="upcoming">À venir ({upcoming.length})</RFTabsTrigger>
            <RFTabsTrigger value="past">Historique ({past.length})</RFTabsTrigger>
          </RFTabsList>
        </div>

        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
        ) : (
          <>
            <RFTabsContent value="upcoming" className="p-4">
              <div className="max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcoming.length === 0 ? emptyState('Aucun trajet à venir') : upcoming.map(renderCard)}
              </div>
            </RFTabsContent>
            <RFTabsContent value="past" className="p-4">
              <div className="max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                {past.length === 0 ? emptyState('Aucun trajet passé') : past.map(renderCard)}
              </div>
            </RFTabsContent>
          </>
        )}
      </RFTabs>
    </div>
  );
}
