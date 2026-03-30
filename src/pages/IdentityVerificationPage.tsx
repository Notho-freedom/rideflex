import React from 'react';
import { ArrowLeft, ShieldCheck, Upload, CheckCircle2, Clock, Camera, FileText } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFBadge } from '../components/rideflex/RFBadge';

interface IdentityVerificationPageProps {
  navigate: (page: string) => void;
}

const steps = [
  { id: 'id', title: "Pièce d'identité", desc: 'Carte d\'identité ou passeport', icon: FileText, status: 'verified' as const },
  { id: 'selfie', title: 'Photo selfie', desc: 'Photo de votre visage pour vérification', icon: Camera, status: 'verified' as const },
  { id: 'phone', title: 'Numéro de téléphone', desc: 'Vérification par code SMS', icon: ShieldCheck, status: 'verified' as const },
  { id: 'license', title: 'Permis de conduire', desc: 'Requis pour les chauffeurs', icon: FileText, status: 'pending' as const },
];

const statusConfig = {
  verified: { label: 'Vérifié', className: 'bg-green-100 text-green-800 border-0', icon: CheckCircle2 },
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-0', icon: Clock },
  required: { label: 'Requis', className: 'bg-muted text-muted-foreground border-0', icon: Upload },
};

export function IdentityVerificationPage({ navigate }: IdentityVerificationPageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-3xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Vérification d'identité</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl lg:max-w-3xl mx-auto">
        <RFCard className="border-brand-teal/30 bg-secondary/5">
          <RFCardContent className="p-5">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-brand-teal" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Profil vérifié à 75%</h2>
                <p className="text-sm text-muted-foreground">Complétez la vérification pour plus de confiance</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-brand-teal h-2 rounded-full transition-all" style={{ width: '75%' }}></div>
            </div>
          </RFCardContent>
        </RFCard>

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {steps.map((step) => {
            const config = statusConfig[step.status];
            const StepIcon = step.icon;
            const StatusIcon = config.icon;
            return (
              <RFCard key={step.id} className={`transition-all ${step.status === 'verified' ? 'border-green-200' : 'border-border'}`}>
                <RFCardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${step.status === 'verified' ? 'bg-green-50 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                  <RFBadge className={config.className}>
                    <StatusIcon className="w-3 h-3 mr-1" />{config.label}
                  </RFBadge>
                </RFCardContent>
              </RFCard>
            );
          })}
        </div>

        <RFSeparator />

        <RFCard>
          <RFCardContent className="p-5 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-brand-blue" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Ajouter votre permis de conduire</h3>
              <p className="text-sm text-muted-foreground">Prenez une photo claire de votre permis recto/verso</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <RFButton variant="brand" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />Prendre une photo
              </RFButton>
              <RFButton variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />Importer depuis la galerie
              </RFButton>
            </div>
          </RFCardContent>
        </RFCard>
      </div>
    </div>
  );
}
