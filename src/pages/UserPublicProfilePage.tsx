import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShieldCheck, MapPin, MessageCircle, Car, Calendar, Loader2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { RFBadge } from '../components/rideflex/RFBadge';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface UserPublicProfilePageProps {
  navigate: (page: string, data?: any) => void;
  userId?: string;
}

export function UserPublicProfilePage({ navigate, userId }: UserPublicProfilePageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [tripCount, setTripCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    loadProfile(userId);
  }, [userId]);

  const loadProfile = async (id: string) => {
    setLoading(true);
    const [profileRes, ratingsRes, tripsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('ratings').select('*, from:profiles!ratings_from_user_id_fkey(full_name, avatar_url)').eq('to_user_id', id).order('created_at', { ascending: false }).limit(10),
      supabase.from('trips').select('id', { count: 'exact', head: true }).eq('driver_id', id),
    ]);
    setProfile(profileRes.data);
    setRatings(ratingsRes.data || []);
    setTripCount(tripsRes.count || 0);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Profil introuvable</h2>
        <RFButton variant="brand" onClick={() => navigate('home')}>Retour</RFButton>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;
  const memberSince = new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-foreground">Profil</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <RFAvatar className="w-24 h-24 mb-4">
            <RFAvatarImage src={profile.avatar_url || `https://i.pravatar.cc/150?u=${userId}`} />
            <RFAvatarFallback className="text-2xl">{(profile.full_name || 'U').charAt(0)}</RFAvatarFallback>
          </RFAvatar>
          <h2 className="text-2xl font-bold text-foreground">{profile.full_name || 'Utilisateur'}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-sm">
              <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
              <span className="font-bold text-foreground">{Number(profile.rating_avg || 0).toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">{profile.total_trips || 0} trajets</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Membre depuis {memberSince}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <RFBadge variant="outline" className="text-secondary"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Identité vérifiée</RFBadge>
          {profile.is_driver && <RFBadge variant="outline"><Car className="w-3.5 h-3.5 mr-1" />Chauffeur</RFBadge>}
          {tripCount > 10 && <RFBadge variant="outline" className="text-primary"><Star className="w-3.5 h-3.5 mr-1" />Expérimenté</RFBadge>}
        </div>

        {/* Bio */}
        {profile.bio && (
          <RFCard>
            <RFCardContent className="p-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">À propos</h3>
              <p className="text-foreground text-sm">{profile.bio}</p>
            </RFCardContent>
          </RFCard>
        )}

        {/* Vehicle */}
        {profile.vehicle_brand && (
          <RFCard>
            <RFCardContent className="p-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Véhicule</h3>
              <p className="text-foreground text-sm">{profile.vehicle_brand} {profile.vehicle_model} • {profile.vehicle_color}</p>
              {profile.license_plate && <p className="text-xs text-muted-foreground mt-1">Plaque : {profile.license_plate}</p>}
            </RFCardContent>
          </RFCard>
        )}

        {/* Action buttons */}
        {!isOwnProfile && (
          <div className="flex gap-3">
            <RFButton variant="brand" size="lg" className="flex-1" onClick={() => navigate('chat', { userId, userName: profile.full_name })}>
              <MessageCircle className="w-5 h-5 mr-2" />Contacter
            </RFButton>
          </div>
        )}

        {isOwnProfile && (
          <RFButton variant="outline" size="lg" className="w-full" onClick={() => navigate('edit-profile')}>
            Modifier mon profil
          </RFButton>
        )}

        {/* Ratings */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Avis ({ratings.length})</h3>
          {ratings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun avis pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {ratings.map((r) => (
                <RFCard key={r.id}>
                  <RFCardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <RFAvatar className="w-8 h-8">
                          <RFAvatarImage src={r.from?.avatar_url || `https://i.pravatar.cc/150?u=${r.from_user_id}`} />
                          <RFAvatarFallback>{(r.from?.full_name || 'U').charAt(0)}</RFAvatarFallback>
                        </RFAvatar>
                        <span className="text-sm font-medium text-foreground">{r.from?.full_name || 'Utilisateur'}</span>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.score ? 'text-yellow-500 fill-current' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    {r.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.tags.map((tag: string, i: number) => <RFBadge key={i} variant="outline" className="text-xs">{tag}</RFBadge>)}
                      </div>
                    )}
                  </RFCardContent>
                </RFCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
