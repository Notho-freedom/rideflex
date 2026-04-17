import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, X, Clock, MapPin, Loader2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface BookingRequestsPageProps {
  navigate: (page: string) => void;
}

export function BookingRequestsPage({ navigate }: BookingRequestsPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: trips } = await supabase.from('trips').select('id').eq('driver_id', user.id);
    const tripIds = (trips || []).map((t: any) => t.id);
    if (tripIds.length === 0) { setRequests([]); setLoading(false); return; }
    const { data } = await supabase
      .from('bookings')
      .select('*, trips(from_city, to_city, departure_date, departure_time, seats_available), profiles:passenger_id(id, full_name, avatar_url, rating_avg)')
      .in('trip_id', tripIds)
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const updateStatus = async (id: string, status: 'accepted' | 'rejected', booking: any) => {
    if (status === 'accepted' && booking.trips && booking.seats > booking.trips.seats_available) {
      toast({ title: 'Plus assez de places', description: 'Le trajet n\'a plus assez de places disponibles.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('bookings').update({ status } as any).eq('id', id);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else { toast({ title: status === 'accepted' ? 'Réservation acceptée' : 'Réservation refusée' }); load(); }
  };

  const pending = requests.filter(r => r.status === 'pending');
  const processed = requests.filter(r => r.status !== 'pending');

  const renderRequest = (req: any) => {
    const passenger = req.profiles;
    const trip = req.trips;
    return (
      <RFCard key={req.id} className="mb-3">
        <RFCardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RFAvatar className="w-12 h-12">
                <RFAvatarImage src={passenger?.avatar_url || undefined} />
                <RFAvatarFallback>{passenger?.full_name?.charAt(0) || '?'}</RFAvatarFallback>
              </RFAvatar>
              <div>
                <p className="font-bold text-foreground">{passenger?.full_name || 'Passager'}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">{Number(passenger?.rating_avg || 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
            {req.status !== 'pending' && (
              <RFBadge className={req.status === 'accepted' ? 'bg-green-100 text-green-800 border-0' : 'bg-red-100 text-red-800 border-0'}>
                {req.status === 'accepted' ? 'Accepté' : req.status === 'cancelled' ? 'Annulé' : 'Refusé'}
              </RFBadge>
            )}
          </div>

          {trip && (
            <div className="bg-muted p-3 rounded-lg space-y-1">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <span className="text-foreground font-medium">{trip.departure_date} • {trip.departure_time?.slice(0, 5)}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 text-primary mr-2 shrink-0" />
                <span className="text-muted-foreground">{trip.from_city} → {trip.to_city}</span>
              </div>
              <p className="text-xs text-muted-foreground">{req.seats} place{req.seats > 1 ? 's' : ''} demandée{req.seats > 1 ? 's' : ''}</p>
            </div>
          )}

          {req.message && (
            <div className="bg-primary/5 p-3 rounded-lg">
              <p className="text-sm text-foreground italic">"{req.message}"</p>
            </div>
          )}

          {req.status === 'pending' && (
            <div className="flex space-x-3 pt-1">
              <RFButton variant="outline" className="flex-1 text-destructive border-destructive/20" onClick={() => updateStatus(req.id, 'rejected', req)}>
                <X className="w-4 h-4 mr-1" />Refuser
              </RFButton>
              <RFButton variant="brand" className="flex-1" onClick={() => updateStatus(req.id, 'accepted', req)}>
                <Check className="w-4 h-4 mr-1" />Accepter
              </RFButton>
            </div>
          )}
        </RFCardContent>
      </RFCard>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('driver-dashboard')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Demandes de réservation</h1>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
      ) : (
        <RFTabs defaultValue="pending" className="w-full mt-4">
          <div className="px-4 max-w-2xl lg:max-w-4xl mx-auto">
            <RFTabsList className="w-full grid grid-cols-2">
              <RFTabsTrigger value="pending">En attente ({pending.length})</RFTabsTrigger>
              <RFTabsTrigger value="processed">Traitées ({processed.length})</RFTabsTrigger>
            </RFTabsList>
          </div>
          <RFTabsContent value="pending" className="p-4">
            <div className="max-w-2xl lg:max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-4">
              {pending.length === 0 ? (
                <div className="text-center py-12 lg:col-span-2">
                  <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Aucune demande en attente</p>
                </div>
              ) : pending.map(renderRequest)}
            </div>
          </RFTabsContent>
          <RFTabsContent value="processed" className="p-4">
            <div className="max-w-2xl lg:max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-4">
              {processed.length === 0 ? (
                <div className="text-center py-12 lg:col-span-2 text-muted-foreground">Aucune demande traitée</div>
              ) : processed.map(renderRequest)}
            </div>
          </RFTabsContent>
        </RFTabs>
      )}
    </div>
  );
}
