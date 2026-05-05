import React, { useState } from 'react';
import { User, Phone, Car, Camera, X } from 'lucide-react';
import { RFButton } from './RFButton';
import { RFInput } from './RFInput';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileCompletionModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: ProfileData) => void;
  mode?: 'passenger' | 'driver';
}

interface ProfileData {
  fullName: string;
  phone: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  licensePlate?: string;
}

export function ProfileCompletionModal({ open, onClose, onComplete, mode = 'passenger' }: ProfileCompletionModalProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProfileData>({ fullName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  if (!open) return null;

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    if (mode === 'driver') {
      await supabase.from('profiles').update({
        full_name: data.fullName,
        phone: data.phone,
        vehicle_brand: data.vehicleBrand || '',
        vehicle_model: data.vehicleModel || '',
        vehicle_color: data.vehicleColor || '',
        license_plate: data.licensePlate || '',
        is_driver: true,
      }).eq('id', user.id);
    } else {
      await supabase.from('profiles').update({
        full_name: data.fullName,
        phone: data.phone,
      }).eq('id', user.id);
    }
    setSaving(false);
    onComplete(data);
  };

  const steps = [
    {
      title: 'Complétez votre profil',
      desc: 'Ces informations sont nécessaires pour continuer.',
      content: (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center relative">
              <User className="w-8 h-8 text-muted-foreground" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <RFInput
              placeholder="Nom complet"
              className="pl-10 h-12"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <RFInput
              placeholder="Numéro de téléphone"
              className="pl-10 h-12"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          </div>
        </div>
      ),
    },
  ];

  if (mode === 'driver') {
    steps.push({
      title: 'Informations véhicule',
      desc: 'Décrivez votre véhicule pour les passagers.',
      content: (
        <div className="space-y-4">
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <RFInput
              placeholder="Marque (ex: Peugeot)"
              className="pl-10 h-12"
              value={data.vehicleBrand || ''}
              onChange={(e) => setData({ ...data, vehicleBrand: e.target.value })}
            />
          </div>
          <RFInput
            placeholder="Modèle (ex: 208)"
            className="h-12"
            value={data.vehicleModel || ''}
            onChange={(e) => setData({ ...data, vehicleModel: e.target.value })}
          />
          <RFInput
            placeholder="Couleur"
            className="h-12"
            value={data.vehicleColor || ''}
            onChange={(e) => setData({ ...data, vehicleColor: e.target.value })}
          />
          <RFInput
            placeholder="Plaque d'immatriculation"
            className="h-12"
            value={data.licensePlate || ''}
            onChange={(e) => setData({ ...data, licensePlate: e.target.value })}
          />
        </div>
      ),
    });
  }

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">{currentStep.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{currentStep.desc}</p>

        {currentStep.content}

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <RFButton variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              Retour
            </RFButton>
          )}
          <RFButton
            variant="brand"
            className="flex-1"
            disabled={saving || !data.fullName.trim()}
            onClick={() => {
              if (isLast) {
                handleComplete();
              } else {
                setStep(step + 1);
              }
            }}
          >
            {saving ? 'Enregistrement...' : isLast ? 'Terminer' : 'Suivant'}
          </RFButton>
        </div>

        {steps.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
