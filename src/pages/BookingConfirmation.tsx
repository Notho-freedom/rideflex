import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface BookingConfirmationProps {
  navigate: (page: string) => void;
}

export function BookingConfirmation({ navigate }: BookingConfirmationProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-brand-teal" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Réservation confirmée !</h1>
        <p className="text-muted-foreground mb-8">Votre place pour le trajet Paris → Lyon a bien été réservée.</p>
        <RFButton variant="brand" size="xl" className="w-full" onClick={() => navigate('home')}>Retour à l'accueil</RFButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center mb-2">
          <button onClick={() => navigate('trip-detail')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Paiement</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <RFCard>
          <RFCardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground mb-4">Résumé</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Trajet (1 place)</span><span className="font-medium">21,00 €</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Frais de service</span><span className="font-medium">4,00 €</span>
            </div>
            <RFSeparator className="my-3" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-brand-blue">25,00 €</span>
            </div>
          </RFCardContent>
        </RFCard>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 px-1">Moyen de paiement</h2>
          <div className="space-y-3">
            <RFCard className={`cursor-pointer border-2 transition-all ${paymentMethod === 'card' ? 'border-brand-blue bg-primary/5' : 'border-border'}`} onClick={() => setPaymentMethod('card')}>
              <RFCardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${paymentMethod === 'card' ? 'bg-brand-blue text-primary-foreground' : 'bg-muted text-muted-foreground'}`}><CreditCard className="w-5 h-5" /></div>
                  <span className="font-semibold text-foreground">Carte bancaire</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-brand-blue' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>}
                </div>
              </RFCardContent>
            </RFCard>

            <RFCard className={`cursor-pointer border-2 transition-all ${paymentMethod === 'cash' ? 'border-brand-teal bg-secondary/5' : 'border-border'}`} onClick={() => setPaymentMethod('cash')}>
              <RFCardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${paymentMethod === 'cash' ? 'bg-brand-teal text-primary-foreground' : 'bg-muted text-muted-foreground'}`}><Banknote className="w-5 h-5" /></div>
                  <div>
                    <span className="font-semibold text-foreground block">Espèces</span>
                    <span className="text-xs text-muted-foreground">Paiement direct au chauffeur</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-brand-teal' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-brand-teal rounded-full"></div>}
                </div>
              </RFCardContent>
            </RFCard>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pb-safe bg-card border-t border-border">
        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => setIsConfirmed(true)}>Payer 25,00 €</RFButton>
      </div>
    </div>
  );
}
