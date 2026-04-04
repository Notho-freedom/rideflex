import React from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Euro, Briefcase, PawPrint, Lock, MessageCircle } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';

interface TripRequestsPageProps {
  navigate: (page: string) => void;
}

const mockRequests = [
  { id: 1, passenger: 'Alice R.', avatar: '20', rating: 4.7, from: 'Montréal', to: 'Ottawa', date: '10 Avril', time: '08:00', seats: 2, price: 25, luggage: true, animals: false, isPrivate: false },
  { id: 2, passenger: 'Thomas B.', avatar: '21', rating: 4.9, from: 'Paris', to: 'Lyon', date: '12 Avril', time: '14:00', seats: 1, price: null, luggage: true, animals: true, isPrivate: false },
  { id: 3, passenger: 'Marie L.', avatar: '22', rating: 5.0, from: 'Douala', to: 'Yaoundé', date: '15 Avril', time: '06:00', seats: 4, price: 5000, luggage: true, animals: false, isPrivate: true },
];

export function TripRequestsPage({ navigate }: TripRequestsPageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('search')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Demandes de passagers</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl lg:max-w-4xl mx-auto">
        <p className="text-sm text-muted-foreground mb-4">{mockRequests.length} demande{mockRequests.length > 1 ? 's' : ''} active{mockRequests.length > 1 ? 's' : ''}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockRequests.map((req) => (
            <RFCard key={req.id} className="hover:shadow-md transition-shadow">
              <RFCardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RFAvatar>
                      <RFAvatarImage src={`https://i.pravatar.cc/150?u=${req.avatar}`} />
                      <RFAvatarFallback>{req.passenger.charAt(0)}</RFAvatarFallback>
                    </RFAvatar>
                    <div>
                      <p className="font-bold text-sm text-foreground">{req.passenger}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="text-yellow-500 mr-1">★</span>{req.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.isPrivate && (
                      <RFBadge className="bg-purple-100 text-purple-800 border-0">
                        <Lock className="w-3 h-3 mr-1" />Privé
                      </RFBadge>
                    )}
                    {req.price && (
                      <span className="font-bold text-brand-blue">{req.price}€</span>
                    )}
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <div className="flex items-center text-sm gap-2">
                    <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                    <span className="font-medium text-foreground">{req.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-foreground">{req.to}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{req.date}, {req.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{req.seats} place{req.seats > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {req.luggage && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />Bagages</span>}
                    {req.animals && <span className="flex items-center gap-1"><PawPrint className="w-3.5 h-3.5" />Animaux</span>}
                  </div>
                </div>

                <RFButton variant="brand" size="sm" className="w-full" onClick={() => navigate('chat')}>
                  <MessageCircle className="w-4 h-4 mr-1" />Contacter
                </RFButton>
              </RFCardContent>
            </RFCard>
          ))}
        </div>
      </div>
    </div>
  );
}
