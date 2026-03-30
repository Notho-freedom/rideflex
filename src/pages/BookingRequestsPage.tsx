import React, { useState } from 'react';
import { ArrowLeft, Check, X, Clock, MapPin } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';

interface BookingRequestsPageProps {
  navigate: (page: string) => void;
}

type RequestStatus = 'pending' | 'accepted' | 'rejected';

interface BookingRequest {
  id: number;
  passenger: string;
  avatar: string;
  rating: number;
  reviews: number;
  from: string;
  to: string;
  date: string;
  seats: number;
  message: string;
  status: RequestStatus;
}

const initialRequests: BookingRequest[] = [
  { id: 1, passenger: 'Emma V.', avatar: '10', rating: 4.8, reviews: 23, from: 'Paris Gare de Lyon', to: 'Lyon Part-Dieu', date: '28 Mars, 14:30', seats: 1, message: 'Bonjour, j\'ai un petit sac à dos uniquement.', status: 'pending' },
  { id: 2, passenger: 'Lucas M.', avatar: '11', rating: 4.5, reviews: 8, from: 'Paris Bercy', to: 'Lyon Perrache', date: '28 Mars, 14:30', seats: 2, message: 'Nous sommes 2 avec une valise chacun.', status: 'pending' },
  { id: 3, passenger: 'Clara D.', avatar: '12', rating: 5.0, reviews: 45, from: 'Paris Centre', to: 'Lyon Centre', date: '25 Mars, 09:00', seats: 1, message: '', status: 'accepted' },
  { id: 4, passenger: 'Hugo T.', avatar: '13', rating: 3.9, reviews: 5, from: 'Paris Sud', to: 'Lyon Nord', date: '24 Mars, 16:00', seats: 1, message: 'J\'ai un gros bagage.', status: 'rejected' },
];

export function BookingRequestsPage({ navigate }: BookingRequestsPageProps) {
  const [requests, setRequests] = useState(initialRequests);

  const updateStatus = (id: number, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const pending = requests.filter(r => r.status === 'pending');
  const processed = requests.filter(r => r.status !== 'pending');

  const renderRequest = (req: BookingRequest) => (
    <RFCard key={req.id} className="mb-3">
      <RFCardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RFAvatar className="w-12 h-12">
              <RFAvatarImage src={`https://i.pravatar.cc/150?u=${req.avatar}`} />
              <RFAvatarFallback>{req.passenger.charAt(0)}</RFAvatarFallback>
            </RFAvatar>
            <div>
              <p className="font-bold text-foreground">{req.passenger}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium mr-1">{req.rating}</span>
                <span>({req.reviews} avis)</span>
              </div>
            </div>
          </div>
          {req.status !== 'pending' && (
            <RFBadge className={req.status === 'accepted' ? 'bg-green-100 text-green-800 border-0' : 'bg-red-100 text-red-800 border-0'}>
              {req.status === 'accepted' ? 'Accepté' : 'Refusé'}
            </RFBadge>
          )}
        </div>

        <div className="bg-muted p-3 rounded-lg space-y-1">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <span className="text-foreground font-medium">{req.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 text-brand-blue mr-2 shrink-0" />
            <span className="text-muted-foreground">{req.from} → {req.to}</span>
          </div>
          <p className="text-xs text-muted-foreground">{req.seats} place{req.seats > 1 ? 's' : ''} demandée{req.seats > 1 ? 's' : ''}</p>
        </div>

        {req.message && (
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-sm text-foreground italic">"{req.message}"</p>
          </div>
        )}

        {req.status === 'pending' && (
          <div className="flex space-x-3 pt-1">
            <RFButton variant="outline" className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => updateStatus(req.id, 'rejected')}>
              <X className="w-4 h-4 mr-1" />Refuser
            </RFButton>
            <RFButton variant="brand" className="flex-1" onClick={() => updateStatus(req.id, 'accepted')}>
              <Check className="w-4 h-4 mr-1" />Accepter
            </RFButton>
          </div>
        )}
      </RFCardContent>
    </RFCard>
  );

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('driver-dashboard')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Demandes de réservation</h1>
        </div>
      </div>

      <RFTabs defaultValue="pending" className="w-full mt-4">
        <div className="px-4 max-w-2xl lg:max-w-4xl mx-auto">
          <RFTabsList className="w-full grid grid-cols-2">
            <RFTabsTrigger value="pending">En attente ({pending.length})</RFTabsTrigger>
            <RFTabsTrigger value="processed">Traitées ({processed.length})</RFTabsTrigger>
          </RFTabsList>
        </div>

        <RFTabsContent value="pending" className="p-4">
          <div className="max-w-2xl lg:max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-4">
            {pending.length === 0 ? (
              <div className="text-center py-12 lg:col-span-2">
                <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Aucune demande en attente</p>
              </div>
            ) : pending.map(renderRequest)}
          </div>
        </RFTabsContent>

        <RFTabsContent value="processed" className="p-4">
          <div className="max-w-2xl lg:max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-4">
            {processed.map(renderRequest)}
          </div>
        </RFTabsContent>
      </RFTabs>
    </div>
  );
}
