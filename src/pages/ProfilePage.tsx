import React, { Fragment } from 'react';
import { Settings, CreditCard, Clock, Star, ChevronRight, LogOut, ShieldCheck, Edit } from 'lucide-react';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFButton } from '../components/rideflex/RFButton';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface ProfilePageProps {
  navigate: (page: string) => void;
}

const menuItems = [
  { icon: Clock, label: 'Historique des trajets', page: 'my-trips' },
  { icon: CreditCard, label: 'Paiements et remboursements', page: 'payment-methods' },
  { icon: ShieldCheck, label: "Vérification d'identité", page: 'identity-verification' },
  { icon: Settings, label: 'Paramètres du compte', page: 'settings' },
];

export function ProfilePage({ navigate }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card px-4 pt-12 pb-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-foreground">Profil</h1>
          <button onClick={() => navigate('edit-profile')} className="p-2 text-brand-blue bg-primary/10 rounded-full">
            <Edit className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <RFAvatar className="w-20 h-20 border-2 border-card shadow-md">
            <RFAvatarImage src="https://i.pravatar.cc/150?u=me" />
            <RFAvatarFallback>ME</RFAvatarFallback>
          </RFAvatar>
          <div>
            <h2 className="text-xl font-bold text-foreground">Alexandre B.</h2>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
              <span className="font-medium mr-1">4.9</span>
              <span>(124 avis)</span>
            </div>
            <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-brand-blue text-xs font-semibold rounded-md">
              Chauffeur & Passager
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4">
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <Fragment key={index}>
              <div
                className="flex items-center justify-between p-4 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => navigate(item.page)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg text-muted-foreground"><item.icon className="w-5 h-5" /></div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              {index < menuItems.length - 1 && <RFSeparator className="ml-14" />}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-6 px-4">
        <RFButton variant="outline" className="w-full h-12 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => navigate('auth')}>
          <LogOut className="w-5 h-5 mr-2" />Se déconnecter
        </RFButton>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground"><p>RideFlex v1.0.0</p></div>
    </div>
  );
}
