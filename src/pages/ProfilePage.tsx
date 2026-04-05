import React, { Fragment } from 'react';
import { Settings, CreditCard, Clock, Star, ChevronRight, LogOut, ShieldCheck, Edit, ArrowLeftRight } from 'lucide-react';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFButton } from '../components/rideflex/RFButton';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFSwitch } from '../components/rideflex/RFSwitch';
import { useUserMode } from '../contexts/UserModeContext';

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
  const { mode, isDriver, toggleMode } = useUserMode();

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        <div className="bg-card px-4 pt-12 lg:pt-6 pb-6 shadow-sm lg:rounded-b-2xl">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-foreground">Profil</h1>
            <button onClick={() => navigate('edit-profile')} className="p-2 text-primary bg-primary/10 rounded-full">
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
              <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-md ${
                isDriver ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
              }`}>
                {isDriver ? '🚗 Chauffeur' : '👤 Passager'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode switch */}
        <div className="mt-6 px-4">
          <div className={`rounded-xl p-4 border-2 transition-colors ${isDriver ? 'border-secondary bg-secondary/5' : 'border-primary bg-primary/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className={`w-5 h-5 ${isDriver ? 'text-secondary' : 'text-primary'}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Mode {isDriver ? 'Chauffeur' : 'Passager'}</p>
                  <p className="text-xs text-muted-foreground">
                    {isDriver ? 'Publiez des trajets et recevez des demandes' : 'Recherchez des chauffeurs et publiez des demandes'}
                  </p>
                </div>
              </div>
              <RFSwitch
                checked={isDriver}
                onCheckedChange={toggleMode}
              />
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
    </div>
  );
}
