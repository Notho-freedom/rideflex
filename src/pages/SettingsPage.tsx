import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Moon, Globe, Shield, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFSwitch } from '../components/rideflex/RFSwitch';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFButton } from '../components/rideflex/RFButton';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

interface SettingsPageProps {
  navigate: (page: string) => void;
}

export function SettingsPage({ navigate }: SettingsPageProps) {
  const { profile, updateProfile } = useProfile() as any;
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const setPref = async (patch: Record<string, any>) => {
    const { error } = await updateProfile(patch);
    if (error) toast({ title: 'Erreur', description: String(error), variant: 'destructive' });
  };

  const deleteAccount = async () => {
    setDeleting(true);
    const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
    setDeleting(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Compte supprimé' });
      await signOut();
    }
  };

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-3xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Paramètres</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl lg:max-w-3xl mx-auto lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="space-y-6">
          <RFCard>
            <RFCardContent className="p-5 space-y-1">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                <Bell className="w-4 h-4 mr-2" />Notifications
              </h2>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications push</p>
                  <p className="text-xs text-muted-foreground">Alertes en temps réel</p>
                </div>
                <RFSwitch checked={profile.notif_push ?? true} onCheckedChange={(v) => setPref({ notif_push: v })} />
              </div>
              <RFSeparator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications email</p>
                  <p className="text-xs text-muted-foreground">Confirmations par email</p>
                </div>
                <RFSwitch checked={profile.notif_email ?? true} onCheckedChange={(v) => setPref({ notif_email: v })} />
              </div>
              <RFSeparator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications SMS</p>
                  <p className="text-xs text-muted-foreground">Alertes par SMS</p>
                </div>
                <RFSwitch checked={profile.notif_sms ?? false} onCheckedChange={(v) => setPref({ notif_sms: v })} />
              </div>
            </RFCardContent>
          </RFCard>

          <RFCard>
            <RFCardContent className="p-5 space-y-1">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                <Moon className="w-4 h-4 mr-2" />Apparence
              </h2>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Mode sombre</p>
                  <p className="text-xs text-muted-foreground">Adapter l'affichage</p>
                </div>
                <RFSwitch checked={profile.dark_mode ?? false} onCheckedChange={(v) => setPref({ dark_mode: v })} />
              </div>
            </RFCardContent>
          </RFCard>
        </div>

        <div className="space-y-6">
          <RFCard>
            <RFCardContent className="p-5 space-y-1">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                <Globe className="w-4 h-4 mr-2" />Général
              </h2>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Langue</p>
                  <p className="text-xs text-muted-foreground">{profile.language === 'en' ? 'English' : 'Français'}</p>
                </div>
                <button onClick={() => setPref({ language: profile.language === 'en' ? 'fr' : 'en' })} className="text-primary text-sm font-medium">
                  Changer
                </button>
              </div>
            </RFCardContent>
          </RFCard>

          <RFCard className="border-destructive/20">
            <RFCardContent className="p-5">
              <h2 className="text-sm font-bold text-destructive uppercase tracking-wider mb-4 flex items-center">
                <Shield className="w-4 h-4 mr-2" />Zone de danger
              </h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <RFButton variant="outline" className="w-full text-destructive border-destructive/20 hover:bg-destructive/5">
                    <Trash2 className="w-4 h-4 mr-2" />Supprimer mon compte
                  </RFButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer définitivement votre compte ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Toutes vos données (trajets, réservations, messages) seront perdues.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount} disabled={deleting} className="bg-destructive">
                      {deleting ? 'Suppression...' : 'Confirmer'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </RFCardContent>
          </RFCard>
        </div>
      </div>
    </div>
  );
}
