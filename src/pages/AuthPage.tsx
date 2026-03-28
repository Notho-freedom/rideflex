import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFInput } from '../components/rideflex/RFInput';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';

interface AuthPageProps {
  navigate: (page: string) => void;
}

export function AuthPage({ navigate }: AuthPageProps) {
  const [role, setRole] = useState('passager');

  return (
    <div className="min-h-screen bg-card flex flex-col">
      <div className="px-4 pt-12 pb-4">
        <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 px-6 flex flex-col justify-center pb-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-brand mb-2">RideFlex</h1>
          <p className="text-muted-foreground">Rejoignez la communauté du covoiturage</p>
        </div>

        <RFTabs defaultValue="login" className="w-full">
          <RFTabsList className="grid w-full grid-cols-2 mb-8">
            <RFTabsTrigger value="login">Connexion</RFTabsTrigger>
            <RFTabsTrigger value="register">Inscription</RFTabsTrigger>
          </RFTabsList>

          <RFTabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <RFInput placeholder="Adresse email" type="email" className="pl-10 h-12" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <RFInput placeholder="Mot de passe" type="password" className="pl-10 h-12" />
              </div>
            </div>
            <div className="text-right">
              <a href="#" className="text-sm text-brand-blue font-medium">Mot de passe oublié ?</a>
            </div>
            <RFButton variant="brand" size="xl" className="w-full mt-4" onClick={() => navigate('home')}>Se connecter</RFButton>
          </RFTabsContent>

          <RFTabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <RFInput placeholder="Nom complet" className="pl-10 h-12" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <RFInput placeholder="Adresse email" type="email" className="pl-10 h-12" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <RFInput placeholder="Mot de passe" type="password" className="pl-10 h-12" />
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-foreground mb-3">Je souhaite utiliser RideFlex en tant que :</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${role === 'passager' ? 'border-brand-blue bg-primary/10 text-brand-blue' : 'border-border text-muted-foreground'}`} onClick={() => setRole('passager')}>
                    <span className="font-semibold text-sm">Passager</span>
                  </div>
                  <div className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${role === 'chauffeur' ? 'border-brand-teal bg-secondary/10 text-brand-teal' : 'border-border text-muted-foreground'}`} onClick={() => setRole('chauffeur')}>
                    <span className="font-semibold text-sm">Chauffeur</span>
                  </div>
                </div>
              </div>
            </div>
            <RFButton variant="brand" size="xl" className="w-full mt-6" onClick={() => navigate('home')}>Créer un compte</RFButton>
          </RFTabsContent>
        </RFTabs>
      </div>
    </div>
  );
}
