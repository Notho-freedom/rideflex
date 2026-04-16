import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Euro, Users, Briefcase, PawPrint, Lock, Loader2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFInput } from '../components/rideflex/RFInput';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFSwitch } from '../components/rideflex/RFSwitch';
import { useTripRequests } from '../hooks/useTripRequests';
import { useToast } from '../hooks/use-toast';

interface PublishRequestPageProps {
  navigate: (page: string) => void;
}

export function PublishRequestPage({ navigate }: PublishRequestPageProps) {
  const [acceptsLuggage, setAcceptsLuggage] = useState(true);
  const [acceptsAnimals, setAcceptsAnimals] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('1');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const { createRequest } = useTripRequests();
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!fromCity || !toCity || !date) {
      toast({ title: 'Champs requis', description: 'Remplissez au moins départ, arrivée et date.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await createRequest({
      from_city: fromCity,
      to_city: toCity,
      desired_date: date,
      desired_time: time || undefined,
      proposed_price: price ? parseFloat(price) : undefined,
      seats_needed: parseInt(seats) || 1,
      accepts_luggage: acceptsLuggage,
      accepts_animals: acceptsAnimals,
      is_private: isPrivate,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de publier la demande.', variant: 'destructive' });
    } else {
      toast({ title: 'Demande publiée !' });
      navigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-xl lg:max-w-3xl mx-auto">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Publier une demande</h1>
        </div>
      </div>

      <div className="p-4 max-w-xl lg:max-w-3xl mx-auto space-y-6">
        <RFCard>
          <RFCardContent className="p-5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Je cherche un trajet</h2>
              <div className="flex items-center space-x-3">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <div className="flex-1"><RFInput placeholder="Ville de départ" value={fromCity} onChange={(e) => setFromCity(e.target.value)} /></div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-secondary w-5 h-5 shrink-0" />
                <div className="flex-1"><RFInput placeholder="Ville d'arrivée" value={toCity} onChange={(e) => setToCity(e.target.value)} /></div>
              </div>
            </div>
            <RFSeparator />
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Date et Heure souhaitées</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-muted-foreground w-5 h-5 shrink-0" />
                  <RFInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            </div>
            <RFSeparator />
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Détails</h2>
              <div className="flex items-center space-x-3">
                <Users className="text-muted-foreground w-5 h-5 shrink-0" />
                <RFInput type="number" placeholder="Nombre de places" value={seats} onChange={(e) => setSeats(e.target.value)} min="1" max="7" className="flex-1" />
              </div>
              <div className="flex items-center space-x-3">
                <Euro className="text-muted-foreground w-5 h-5 shrink-0" />
                <div className="flex-1 relative">
                  <RFInput type="number" placeholder="Prix proposé (optionnel)" value={price} onChange={(e) => setPrice(e.target.value)} className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                </div>
              </div>
            </div>
            <RFSeparator />
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Préférences</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-foreground">Bagages</span></div>
                <RFSwitch checked={acceptsLuggage} onCheckedChange={setAcceptsLuggage} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><PawPrint className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-foreground">Animaux</span></div>
                <RFSwitch checked={acceptsAnimals} onCheckedChange={setAcceptsAnimals} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div><span className="text-sm text-foreground block">Trajet privé</span><span className="text-xs text-muted-foreground">Réserver toute la voiture</span></div>
                </div>
                <RFSwitch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>
            </div>
          </RFCardContent>
        </RFCard>

        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publier ma demande'}
        </RFButton>
      </div>
    </div>
  );
}
