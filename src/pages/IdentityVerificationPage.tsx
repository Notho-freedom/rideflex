import React, { useRef } from 'react';
import { ArrowLeft, ShieldCheck, FileText, Camera, Upload, CheckCircle2, Clock, Loader2, User } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFBadge } from '../components/rideflex/RFBadge';
import { Progress } from '../components/ui/progress';
import { useIdentityVerification, IdDocType } from '../hooks/useIdentityVerification';
import { useToast } from '../hooks/use-toast';

interface IdentityVerificationPageProps {
  navigate: (page: string) => void;
}

const STEPS: { id: IdDocType; title: string; description: string; icon: any }[] = [
  { id: 'phone', title: 'Téléphone vérifié', description: 'Numéro confirmé par SMS', icon: User },
  { id: 'id_card', title: "Pièce d'identité", description: "Carte d'identité ou passeport", icon: FileText },
  { id: 'selfie', title: 'Selfie', description: 'Photo de votre visage', icon: Camera },
  { id: 'license', title: 'Permis de conduire', description: 'Recto et verso', icon: FileText },
];

export function IdentityVerificationPage({ navigate }: IdentityVerificationPageProps) {
  const { docs, loading, uploadDocument, setPhoneVerified } = useIdentityVerification();
  const { toast } = useToast();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getDoc = (type: IdDocType) => docs.find((d) => d.type === type);
  const verifiedCount = docs.filter((d) => d.status === 'verified').length;
  const progress = Math.round((verifiedCount / STEPS.length) * 100);

  const handleUpload = async (type: IdDocType, file: File | null) => {
    if (!file) return;
    const { error } = await uploadDocument(type, file);
    if (error) toast({ title: 'Erreur', description: String(error), variant: 'destructive' });
    else toast({ title: 'Document envoyé', description: 'Vérification en cours.' });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Vérification d'identité</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <RFCard className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <RFCardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h2 className="font-bold text-foreground">Niveau de vérification</h2>
              </div>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{verifiedCount} / {STEPS.length} étapes complétées</p>
          </RFCardContent>
        </RFCard>

        {loading ? (
          <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
        ) : STEPS.map((step) => {
          const doc = getDoc(step.id);
          const status = doc?.status || 'required';
          const Icon = step.icon;
          return (
            <RFCard key={step.id}>
              <RFCardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${status === 'verified' ? 'bg-green-100 text-green-700' : status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <RFBadge className={status === 'verified' ? 'bg-green-100 text-green-800 border-0' : status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-0' : 'bg-muted text-muted-foreground border-0'}>
                    {status === 'verified' ? <><CheckCircle2 className="w-3 h-3 mr-1" />Vérifié</> : status === 'pending' ? <><Clock className="w-3 h-3 mr-1" />En cours</> : 'Requis'}
                  </RFBadge>
                </div>

                {status !== 'verified' && (
                  step.id === 'phone' ? (
                    <RFButton variant="outline" size="sm" className="w-full" onClick={setPhoneVerified}>
                      Vérifier mon téléphone
                    </RFButton>
                  ) : (
                    <>
                      <input
                        ref={(el) => (fileRefs.current[step.id] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(step.id, e.target.files?.[0] || null)}
                      />
                      <RFButton variant="outline" size="sm" className="w-full" onClick={() => fileRefs.current[step.id]?.click()}>
                        <Upload className="w-4 h-4 mr-2" />Téléverser
                      </RFButton>
                    </>
                  )
                )}
              </RFCardContent>
            </RFCard>
          );
        })}
      </div>
    </div>
  );
}
