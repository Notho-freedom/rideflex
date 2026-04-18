import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, User, Mail, Phone, Car, Loader2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

interface EditProfilePageProps {
  navigate: (page: string) => void;
}

export function EditProfilePage({ navigate }: EditProfilePageProps) {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setVehicleBrand(profile.vehicle_brand || '');
      setVehicleModel(profile.vehicle_model || '');
      setVehicleColor(profile.vehicle_color || '');
      setLicensePlate(profile.license_plate || '');
      setWhatsapp((profile as any).whatsapp_number || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      full_name: name,
      phone,
      bio,
      vehicle_brand: vehicleBrand,
      vehicle_model: vehicleModel,
      vehicle_color: vehicleColor,
      license_plate: licensePlate,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' });
    } else {
      toast({ title: 'Profil mis à jour !' });
      navigate('profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: 'Erreur upload', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    const bustedUrl = `${urlData.publicUrl}?v=${Date.now()}`;
    await updateProfile({ avatar_url: bustedUrl });
    setUploading(false);
    toast({ title: 'Photo mise à jour !' });
  };

  if (profileLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2 max-w-xl lg:max-w-2xl mx-auto">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground">Modifier le profil</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-xl lg:max-w-2xl mx-auto">
        <div className="flex justify-center">
          <div className="relative">
            <RFAvatar className="w-24 h-24 border-2 border-card shadow-md">
              <RFAvatarImage src={profile?.avatar_url || ''} />
              <RFAvatarFallback>{name?.charAt(0) || 'U'}</RFAvatarFallback>
            </RFAvatar>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
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
                    <RFInput value={user?.email || ''} type="email" disabled className="opacity-60" />
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
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" />
              </div>
            </RFCardContent>
          </RFCard>

          <RFCard>
            <RFCardContent className="p-5 space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Véhicule</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Marque</label>
                  <div className="flex items-center space-x-3">
                    <Car className="text-muted-foreground w-5 h-5 shrink-0" />
                    <RFInput value={vehicleBrand} onChange={(e) => setVehicleBrand(e.target.value)} placeholder="Ex: Peugeot" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Modèle</label>
                  <RFInput value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Ex: 208" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Couleur</label>
                  <RFInput value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} placeholder="Ex: Blanche" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Plaque d'immatriculation</label>
                  <RFInput value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="Ex: AB-123-CD" />
                </div>
              </div>
            </RFCardContent>
          </RFCard>
        </div>

        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enregistrer les modifications'}
        </RFButton>
      </div>
    </div>
  );
}
