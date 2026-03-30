import React from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Euro } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface PublishPageProps {
  navigate: (page: string) => void;
}

export function PublishPage({ navigate }: PublishPageProps) {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-xl lg:max-w-2xl mx-auto">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Publier un trajet</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-xl lg:max-w-2xl mx-auto">
        <RFCard>
          <RFCardContent className="p-5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Itinéraire</h2>
              <div className="flex items-center space-x-3">
                <MapPin className="text-brand-blue w-5 h-5" />
                <div className="flex-1"><RFInput placeholder="Lieu de départ exact" /></div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-brand-teal w-5 h-5" />
                <div className="flex-1"><RFInput placeholder="Lieu d'arrivée exact" /></div>
              </div>
            </div>

            <RFSeparator />

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Date et Heure</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-muted-foreground w-5 h-5" />
                  <RFInput type="date" className="text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-muted-foreground w-5 h-5" />
                  <RFInput type="time" className="text-muted-foreground" />
                </div>
              </div>
            </div>

            <RFSeparator />

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Détails</h2>
              <div className="flex items-center space-x-3">
                <Users className="text-muted-foreground w-5 h-5" />
                <div className="flex-1 flex items-center justify-between border border-border rounded-md px-3 py-2">
                  <span className="text-sm text-muted-foreground">Places disponibles</span>
                  <div className="flex items-center space-x-3">
                    <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">-</button>
                    <span className="font-semibold">3</span>
                    <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">+</button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Euro className="text-muted-foreground w-5 h-5" />
                <div className="flex-1 relative">
                  <RFInput type="number" placeholder="Prix par passager" className="pl-3 pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                </div>
              </div>
            </div>
          </RFCardContent>
        </RFCard>

        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => { alert('Trajet publié avec succès !'); navigate('home'); }}>
          Publier mon trajet
        </RFButton>
      </div>
    </div>
  );
}
