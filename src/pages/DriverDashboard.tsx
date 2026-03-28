import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Settings, Car } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent, RFCardHeader, RFCardTitle } from '../components/rideflex/RFCard';
import { RFSwitch } from '../components/rideflex/RFSwitch';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';
import { RFBadge } from '../components/rideflex/RFBadge';
import { RFInput } from '../components/rideflex/RFInput';

interface DriverDashboardProps {
  navigate: (page: string, data?: any) => void;
}

export function DriverDashboard({ navigate }: DriverDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center mb-2">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Espace Chauffeur</h1>
        </div>
      </div>

      <RFTabs defaultValue="mode-dispo" className="w-full mt-4">
        <div className="px-4">
          <RFTabsList className="w-full grid grid-cols-2">
            <RFTabsTrigger value="mode-dispo">Mode Dispo</RFTabsTrigger>
            <RFTabsTrigger value="mes-trajets">Mes Trajets</RFTabsTrigger>
          </RFTabsList>
        </div>

        <RFTabsContent value="mode-dispo" className="p-4 space-y-6">
          <RFCard className={`border-2 transition-colors ${isAvailable ? 'border-brand-teal bg-secondary/5' : 'border-border'}`}>
            <RFCardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Mode Disponible</h2>
                  <p className="text-sm text-muted-foreground">Recevez des demandes en temps réel</p>
                </div>
                <RFSwitch checked={isAvailable} onCheckedChange={setIsAvailable} className={isAvailable ? 'bg-brand-teal' : ''} />
              </div>
              {isAvailable && (
                <div className="mt-4 pt-4 border-t border-border flex items-center text-brand-teal">
                  <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse mr-2"></div>
                  <span className="text-sm font-medium">Vous êtes visible par les passagers</span>
                </div>
              )}
            </RFCardContent>
          </RFCard>

          <RFCard>
            <RFCardHeader className="pb-3">
              <RFCardTitle className="text-base flex items-center">
                <Settings className="w-4 h-4 mr-2 text-muted-foreground" />Paramètres de disponibilité
              </RFCardTitle>
            </RFCardHeader>
            <RFCardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Zone de départ actuelle</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-brand-blue w-5 h-5" />
                  <RFInput defaultValue="Paris Centre" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rayon d'acceptation (km)</label>
                <div className="flex items-center space-x-4">
                  <input type="range" min="1" max="50" defaultValue="10" className="flex-1 accent-brand-blue" />
                  <span className="font-bold text-brand-blue w-8 text-right">10</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Disponibilité jusqu'à</label>
                <div className="flex items-center space-x-2">
                  <Clock className="text-muted-foreground w-5 h-5" />
                  <RFInput type="time" defaultValue="18:00" className="flex-1" />
                </div>
              </div>
            </RFCardContent>
          </RFCard>
        </RFTabsContent>

        <RFTabsContent value="mes-trajets" className="p-4 space-y-4">
          <RFCard>
            <RFCardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <RFBadge className="bg-green-100 text-green-800 border-0">Confirmé</RFBadge>
                <span className="font-bold text-brand-blue text-lg">45€</span>
              </div>
              <div className="relative pl-4 border-l-2 border-border space-y-4 ml-2 mb-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-card border-2 border-brand-blue rounded-full"></div>
                  <p className="text-sm font-semibold">14:30 - Paris</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-brand-teal rounded-full"></div>
                  <p className="text-sm font-semibold">18:00 - Lyon</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">3 passagers</span>
                </div>
                <RFButton variant="outline" size="sm" onClick={() => navigate('trip-detail')}>Détails</RFButton>
              </div>
            </RFCardContent>
          </RFCard>

          <RFButton variant="outline" className="w-full" onClick={() => navigate('booking-requests')}>
            Voir les demandes de réservation
          </RFButton>
        </RFTabsContent>
      </RFTabs>
    </div>
  );
}
