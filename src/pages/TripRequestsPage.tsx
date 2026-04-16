import React, { useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Euro, Briefcase, PawPrint, Lock, MessageCircle, Loader2 } from 'lucide-react';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFButton } from '../components/rideflex/RFButton';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFBadge } from '../components/rideflex/RFBadge';
import { useTripRequests } from '../hooks/useTripRequests';

interface TripRequestsPageProps {
  navigate: (page: string, data?: any) => void;
}

export function TripRequestsPage({ navigate }: TripRequestsPageProps) {
  const { requests, loading, fetchActiveRequests } = useTripRequests();

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm">
        <div className="flex items-center mb-2 max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('search')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Demandes de passagers</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl lg:max-w-4xl mx-auto">
        <p className="text-sm text-muted-foreground mb-4">{requests.length} demande{requests.length > 1 ? 's' : ''} active{requests.length > 1 ? 's' : ''}</p>
        {requests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-medium">Aucune demande active pour le moment.</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((req) => (
            <RFCard key={req.id} className="hover:shadow-md transition-shadow">
              <RFCardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RFAvatar>
                      <RFAvatarImage src={req.publisher?.avatar_url || ''} />
                      <RFAvatarFallback>{req.publisher?.full_name?.charAt(0) || 'U'}</RFAvatarFallback>
                    </RFAvatar>
                    <div>
                      <p className="font-bold text-sm text-foreground">{req.publisher?.full_name || 'Anonyme'}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="text-yellow-500 mr-1">★</span>{req.publisher?.rating_avg?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.is_private && (
                      <RFBadge className="bg-purple-100 text-purple-800 border-0"><Lock className="w-3 h-3 mr-1" />Privé</RFBadge>
                    )}
                    {req.proposed_price && <span className="font-bold text-primary">{req.proposed_price}€</span>}
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <div className="flex items-center text-sm gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{req.from_city}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-foreground">{req.to_city}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{req.desired_date}{req.desired_time ? `, ${req.desired_time}` : ''}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{req.seats_needed} place{req.seats_needed > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {req.accepts_luggage && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />Bagages</span>}
                    {req.accepts_animals && <span className="flex items-center gap-1"><PawPrint className="w-3.5 h-3.5" />Animaux</span>}
                  </div>
                </div>

                <RFButton variant="brand" size="sm" className="w-full" onClick={() => navigate('chat', { userId: req.publisher_id, userName: req.publisher?.full_name })}>
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
