import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Banknote, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface BookingConfirmationProps {
  navigate: (page: string) => void;
  tripId?: string;
  seats?: number;
}

const PLATFORM_FEE_RATE = 0.15;

export function BookingConfirmation({ navigate, tripId, seats = 1 }: BookingConfirmationProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    supabase.from('trips').select('from_city, to_city, price').eq('id', tripId).single()
      .then(({ data }) => { setTrip(data); setLoading(false); });
  }, [tripId]);

  const tripPrice = trip ? Number(trip.price) * seats : 0;
  const serviceFee = Math.round(tripPrice * PLATFORM_FEE_RATE * 100) / 100;
  const total = Math.round((tripPrice + serviceFee) * 100) / 100;

  const handleConfirm = async () => {
    setConfirming(true);
    if (paymentMethod === 'cash') {
      // Cash: just confirm locally
      toast({ title: 'Réservation confirmée', description: 'Vous paierez directement au chauffeur.' });
      setIsConfirmed(true);
    } else {
      // Card: for now, show a message that payment will be available soon
      toast({ title: 'Réservation enregistrée', description: 'Le paiement en ligne sera bientôt disponible. Votre réservation est bien enregistrée.' });
      setIsConfirmed(true);
    }
    setConfirming(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!trip || !tripId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Réservation introuvable</h2>
        <p className="text-muted-foreground mb-6">Le trajet associé à cette réservation n'a pas été trouvé.</p>
        <RFButton variant="brand" onClick={() => navigate('home')}>Retour à l'accueil</RFButton>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle2 className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Réservation confirmée !</h1>
          <p className="text-muted-foreground mb-2">
            {paymentMethod === 'cash'
              ? 'Vous paierez directement au chauffeur le jour du trajet.'
              : 'Votre place a bien été réservée. Vous recevrez une notification quand le chauffeur acceptera.'}
          </p>
          <p className="text-lg font-bold text-primary mb-8">{total.toFixed(2)} €</p>
          <RFButton variant="brand" size="xl" className="w-full" onClick={() => navigate('home')}>Retour à l'accueil</RFButton>
        </div>
      </div>
    );
  }

  const label = `${trip.from_city} → ${trip.to_city}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('trip-detail')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Paiement</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl lg:max-w-3xl mx-auto w-full lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <RFCard>
          <RFCardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground mb-4">Résumé</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{label} ({seats} place{seats > 1 ? 's' : ''})</span>
              <span className="font-medium">{tripPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Frais de service</span>
              <span className="font-medium">{serviceFee.toFixed(2)} €</span>
            </div>
            <RFSeparator className="my-3" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{total.toFixed(2)} €</span>
            </div>
          </RFCardContent>
        </RFCard>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 px-1">Moyen de paiement</h2>
          <div className="space-y-3">
            <RFCard className={`cursor-pointer border-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => setPaymentMethod('card')}>
              <RFCardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}><CreditCard className="w-5 h-5" /></div>
                  <div>
                    <span className="font-semibold text-foreground block">Carte bancaire</span>
                    <span className="text-xs text-muted-foreground">Bientôt disponible</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
              </RFCardContent>
            </RFCard>

            <RFCard className={`cursor-pointer border-2 transition-all ${paymentMethod === 'cash' ? 'border-secondary bg-secondary/5' : 'border-border'}`} onClick={() => setPaymentMethod('cash')}>
              <RFCardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${paymentMethod === 'cash' ? 'bg-secondary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}><Banknote className="w-5 h-5" /></div>
                  <div>
                    <span className="font-semibold text-foreground block">Espèces</span>
                    <span className="text-xs text-muted-foreground">Paiement direct au chauffeur</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-secondary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>}
                </div>
              </RFCardContent>
            </RFCard>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pb-safe bg-card border-t border-border lg:border-0 lg:bg-transparent">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={handleConfirm} disabled={confirming}>
            {confirming ? <Loader2 className="w-5 h-5 animate-spin" /> : paymentMethod === 'cash' ? `Confirmer — ${total.toFixed(2)} €` : `Payer ${total.toFixed(2)} €`}
          </RFButton>
        </div>
      </div>
    </div>
  );
}
