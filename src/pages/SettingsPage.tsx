import React, { useState } from 'react';
import { ArrowLeft, Bell, Moon, Globe, Shield, Trash2, ChevronRight } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFSwitch } from '../components/rideflex/RFSwitch';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFButton } from '../components/rideflex/RFButton';

interface SettingsPageProps {
  navigate: (page: string) => void;
}

export function SettingsPage({ navigate }: SettingsPageProps) {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
                  <p className="text-xs text-muted-foreground">Recevez des alertes en temps réel</p>
                </div>
                <RFSwitch checked={pushNotifs} onCheckedChange={setPushNotifs} />
              </div>
              <RFSeparator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications email</p>
                  <p className="text-xs text-muted-foreground">Résumé et confirmations par email</p>
                </div>
                <RFSwitch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <RFSeparator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications SMS</p>
                  <p className="text-xs text-muted-foreground">Alertes importantes par SMS</p>
                </div>
                <RFSwitch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
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
                  <p className="text-xs text-muted-foreground">Adapter l'affichage pour la nuit</p>
                </div>
                <RFSwitch checked={darkMode} onCheckedChange={setDarkMode} />
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
              <div className="flex items-center justify-between py-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">Langue</p>
                  <p className="text-xs text-muted-foreground">Français</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <RFSeparator />
              <div className="flex items-center justify-between py-3 cursor-pointer">
                <div><p className="text-sm font-medium text-foreground">Politique de confidentialité</p></div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <RFSeparator />
              <div className="flex items-center justify-between py-3 cursor-pointer">
                <div><p className="text-sm font-medium text-foreground">Conditions d'utilisation</p></div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </RFCardContent>
          </RFCard>

          <RFCard className="border-destructive/20">
            <RFCardContent className="p-5">
              <h2 className="text-sm font-bold text-destructive uppercase tracking-wider mb-4 flex items-center">
                <Shield className="w-4 h-4 mr-2" />Zone de danger
              </h2>
              <RFButton variant="outline" className="w-full text-destructive border-destructive/20 hover:bg-destructive/5">
                <Trash2 className="w-4 h-4 mr-2" />Supprimer mon compte
              </RFButton>
            </RFCardContent>
          </RFCard>
        </div>
      </div>
    </div>
  );
}
