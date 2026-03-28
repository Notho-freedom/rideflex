import React, { useState } from 'react';
import { ArrowLeft, Camera, User, Mail, Phone, Car } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface EditProfilePageProps {
  navigate: (page: string) => void;
}

export function EditProfilePage({ navigate }: EditProfilePageProps) {
  const [name, setName] = useState('Alexandre Bertrand');
  const [email, setEmail] = useState('alexandre.b@email.com');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [bio, setBio] = useState('Chauffeur & passager régulier sur Paris-Lyon. J\'aime la bonne musique et les bonnes conversations !');
  const [vehicle, setVehicle] = useState('Peugeot 208');
  const [vehicleColor, setVehicleColor] = useState('Blanche');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground">Modifier le profil</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <RFAvatar className="w-24 h-24 border-2 border-card shadow-md">
              <RFAvatarImage src="https://i.pravatar.cc/150?u=me" />
              <RFAvatarFallback>AB</RFAvatarFallback>
            </RFAvatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-primary-foreground shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <RFCard>
          <RFCardContent className="p-5 space-y-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Informations personnelles</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom complet</label>
                <div className="flex items-center space-x-3">
                  <User className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="flex items-center space-x-3">
                  <Mail className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Téléphone</label>
                <div className="flex items-center space-x-3">
                  <Phone className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                </div>
              </div>
            </div>

            <RFSeparator />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
          </RFCardContent>
        </RFCard>

        {/* Vehicle Info */}
        <RFCard>
          <RFCardContent className="p-5 space-y-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Véhicule</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Modèle</label>
                <div className="flex items-center space-x-3">
                  <Car className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Couleur</label>
                <RFInput value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
              </div>
            </div>
          </RFCardContent>
        </RFCard>

        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => { alert('Profil mis à jour !'); navigate('profile'); }}>
          Enregistrer les modifications
        </RFButton>
      </div>
    </div>
  );
}
