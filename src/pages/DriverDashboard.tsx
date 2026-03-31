import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Settings, Radio } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent, RFCardHeader, RFCardTitle } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';

interface DriverDashboardProps {
  navigate: (page: string, data?: any) => void;
}

export function DriverDashboard({ navigate }: DriverDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [radius, setRadius] = useState(10);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Mode Disponible</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl lg:max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Map area */}
        <div className="mb-6 lg:mb-0">
          <RFCard className="h-72 lg:h-full lg:min-h-[400px] overflow-hidden border-0 shadow-lg">
            <RFCardContent className="p-0 h-full relative">
              {!isAvailable ? (
                /* Inactive: stylized placeholder */
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex flex-col items-center justify-center">
                  {/* Decorative circles */}
                  <div className="absolute w-48 h-48 rounded-full border-2 border-brand-blue/10 animate-pulse" />
                  <div className="absolute w-32 h-32 rounded-full border-2 border-brand-teal/15" />

                  {/* SVG illustration */}
                  <svg viewBox="0 0 120 120" className="w-24 h-24 mb-4 opacity-60">
                    <defs>
                      <linearGradient id="dispoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'hsl(214 100% 50%)', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: 'hsl(168 100% 39%)', stopOpacity: 0.6 }} />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="50" fill="url(#dispoGrad)" opacity="0.15" />
                    <circle cx="60" cy="60" r="35" fill="url(#dispoGrad)" opacity="0.1" />
                    <circle cx="60" cy="55" r="6" fill="url(#dispoGrad)" />
                    <path d="M60 61 C60 61 45 75 45 82 C45 92 55 97 60 97 C65 97 75 92 75 82 C75 75 60 61 60 61Z" fill="url(#dispoGrad)" opacity="0.5" />
                    {/* Signal waves */}
                    <path d="M40 35 Q50 25 60 35" stroke="url(#dispoGrad)" strokeWidth="2" fill="none" opacity="0.4" />
                    <path d="M35 28 Q52 15 68 28" stroke="url(#dispoGrad)" strokeWidth="2" fill="none" opacity="0.3" />
                  </svg>

                  <RFButton
                    variant="brand"
                    size="xl"
                    className="shadow-xl px-8"
                    onClick={() => setIsAvailable(true)}
                  >
                    <Radio className="w-5 h-5 mr-2" />
                    Activer le mode dispo
                  </RFButton>
                </div>
              ) : (
                /* Active: simulated map with marker and radius */
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(hsl(214 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(214 100% 50%) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />

                  {/* Radius circle */}
                  <div
                    className="rounded-full border-2 border-brand-blue/30 bg-brand-blue/5 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${Math.min(radius * 8, 280)}px`, height: `${Math.min(radius * 8, 280)}px` }}
                  >
                    {/* Center marker */}
                    <div className="w-4 h-4 rounded-full bg-brand-blue shadow-lg relative">
                      <div className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-30" />
                    </div>
                  </div>

                  {/* Active badge */}
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    <span className="text-xs font-semibold text-brand-teal">En ligne</span>
                  </div>

                  {/* Deactivate button */}
                  <button
                    onClick={() => setIsAvailable(false)}
                    className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-destructive shadow-sm hover:bg-card transition-colors"
                  >
                    Désactiver
                  </button>
                </div>
              )}
            </RFCardContent>
          </RFCard>
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          <RFCard className={`border-2 transition-colors ${isAvailable ? 'border-brand-teal bg-secondary/5' : 'border-border'}`}>
            <RFCardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Mode Disponible</h2>
                  <p className="text-sm text-muted-foreground">
                    {isAvailable ? 'Vous êtes visible par les passagers' : 'Activez pour recevoir des demandes'}
                  </p>
                </div>
                {isAvailable && (
                  <div className="flex items-center text-brand-teal">
                    <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse mr-2" />
                    <span className="text-sm font-semibold">Actif</span>
                  </div>
                )}
              </div>
            </RFCardContent>
          </RFCard>

          <RFCard>
            <RFCardHeader className="pb-3">
              <RFCardTitle className="text-base flex items-center">
                <Settings className="w-4 h-4 mr-2 text-muted-foreground" />Paramètres
              </RFCardTitle>
            </RFCardHeader>
            <RFCardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Zone de départ</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-brand-blue w-5 h-5 shrink-0" />
                  <RFInput defaultValue="Paris Centre" className="flex-1" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Rayon d'acceptation</label>
                  <span className="font-bold text-brand-blue">{radius} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-brand-blue"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Disponible jusqu'à</label>
                <div className="flex items-center space-x-2">
                  <Clock className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput type="time" defaultValue="18:00" className="flex-1" />
                </div>
              </div>
            </RFCardContent>
          </RFCard>
        </div>
      </div>
    </div>
  );
}
