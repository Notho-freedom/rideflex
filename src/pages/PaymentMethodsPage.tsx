import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFInput } from '../components/rideflex/RFInput';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { useToast } from '../hooks/use-toast';

interface PaymentMethodsPageProps {
  navigate: (page: string) => void;
}

function detectBrand(num: string): string {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  return 'Carte';
}

export function PaymentMethodsPage({ navigate }: PaymentMethodsPageProps) {
  const { methods, loading, addMethod, setDefault, deleteMethod } = usePaymentMethods();
  const { toast } = useToast();
  const [showAddCard, setShowAddCard] = useState(false);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    const last4 = number.replace(/\s/g, '').slice(-4);
    if (last4.length !== 4 || !expiry) {
      toast({ title: 'Champs requis', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await addMethod({ brand: detectBrand(number), last4, expiry });
    setSaving(false);
    if (error) toast({ title: 'Erreur', description: String(error), variant: 'destructive' });
    else { toast({ title: 'Carte ajoutée' }); setShowAddCard(false); setNumber(''); setExpiry(''); }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-xl lg:max-w-2xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Moyens de paiement</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-xl lg:max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
        ) : methods.length === 0 && !showAddCard ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Aucun moyen de paiement</p>
          </div>
        ) : methods.map((card) => (
          <RFCard key={card.id} className={`border-2 ${card.is_default ? 'border-primary' : 'border-border'}`}>
            <RFCardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 cursor-pointer" onClick={() => !card.is_default && setDefault(card.id)}>
                <div className={`p-3 rounded-xl ${card.is_default ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{card.brand} •••• {card.last4}</p>
                  <p className="text-xs text-muted-foreground">Expire {card.expiry}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {card.is_default && <CheckCircle2 className="w-5 h-5 text-primary" />}
                <button onClick={() => deleteMethod(card.id)} className="p-2 text-muted-foreground hover:text-destructive">
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Numéro de carte</label>
                <RFInput placeholder="1234 5678 9012 3456" value={number} onChange={(e) => setNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Expiration</label>
                  <RFInput placeholder="MM/AA" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">CVC</label>
                  <RFInput placeholder="123" />
                </div>
              </div>
              <RFSeparator />
              <div className="flex space-x-3">
                <RFButton variant="outline" className="flex-1" onClick={() => setShowAddCard(false)}>Annuler</RFButton>
                <RFButton variant="brand" className="flex-1" onClick={handleAdd} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter'}
                </RFButton>
              </div>
            </RFCardContent>
          </RFCard>
        )}

        <RFSeparator className="my-4" />
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Vos données sont sécurisées et chiffrées.</p>
        </div>
      </div>
    </div>
  );
}
