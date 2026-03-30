import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFInput } from '../components/rideflex/RFInput';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface PaymentMethodsPageProps {
  navigate: (page: string) => void;
}

const savedCards = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/27', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/26', isDefault: false },
];

export function PaymentMethodsPage({ navigate }: PaymentMethodsPageProps) {
  const [showAddCard, setShowAddCard] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-xl lg:max-w-2xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Moyens de paiement</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-xl lg:max-w-2xl mx-auto">
        {savedCards.map((card) => (
          <RFCard key={card.id} className={`border-2 transition-all ${card.isDefault ? 'border-brand-blue' : 'border-border'}`}>
            <RFCardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${card.isDefault ? 'bg-primary/10 text-brand-blue' : 'bg-muted text-muted-foreground'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{card.type} •••• {card.last4}</p>
                  <p className="text-xs text-muted-foreground">Expire {card.expiry}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {card.isDefault && <CheckCircle2 className="w-5 h-5 text-brand-blue" />}
                <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </RFCardContent>
          </RFCard>
        ))}

        {!showAddCard ? (
          <RFButton variant="outline" className="w-full h-14 border-dashed border-2" onClick={() => setShowAddCard(true)}>
            <Plus className="w-5 h-5 mr-2" />Ajouter une carte
          </RFButton>
        ) : (
          <RFCard>
            <RFCardContent className="p-5 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Nouvelle carte</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Numéro de carte</label>
                  <RFInput placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Expiration</label>
                    <RFInput placeholder="MM/AA" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">CVC</label>
                    <RFInput placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nom sur la carte</label>
                  <RFInput placeholder="Alexandre Bertrand" />
                </div>
              </div>
              <RFSeparator />
              <div className="flex space-x-3">
                <RFButton variant="outline" className="flex-1" onClick={() => setShowAddCard(false)}>Annuler</RFButton>
                <RFButton variant="brand" className="flex-1" onClick={() => { alert('Carte ajoutée !'); setShowAddCard(false); }}>Ajouter</RFButton>
              </div>
            </RFCardContent>
          </RFCard>
        )}

        <RFSeparator className="my-4" />
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Vos données bancaires sont sécurisées et chiffrées.</p>
          <p className="text-xs text-muted-foreground mt-1">Paiements traités par Stripe</p>
        </div>
      </div>
    </div>
  );
}
