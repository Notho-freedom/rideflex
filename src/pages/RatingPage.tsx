import React, { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface RatingPageProps {
  navigate: (page: string) => void;
}

const tags = ['Ponctuel', 'Conduite douce', 'Bonne conversation', 'Véhicule propre', 'Sympathique', 'Musique agréable'];

export function RatingPage({ navigate }: RatingPageProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
          <Star className="w-12 h-12 text-yellow-500 fill-current" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Merci pour votre avis !</h1>
        <p className="text-muted-foreground mb-8">Votre évaluation aide la communauté RideFlex.</p>
        <RFButton variant="brand" size="xl" className="w-full" onClick={() => navigate('home')}>Retour à l'accueil</RFButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center mb-2">
          <button onClick={() => navigate('my-trips')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-foreground ml-2">Évaluer le trajet</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Driver Info */}
        <div className="flex flex-col items-center text-center pt-4">
          <RFAvatar className="w-20 h-20 border-2 border-card shadow-md mb-3">
            <RFAvatarImage src="https://i.pravatar.cc/150?u=3" />
            <RFAvatarFallback>JL</RFAvatarFallback>
          </RFAvatar>
          <h2 className="text-lg font-bold text-foreground">Julie L.</h2>
          <p className="text-sm text-muted-foreground">Paris → Bordeaux • 15 Mars 2026</p>
        </div>

        {/* Stars */}
        <RFCard>
          <RFCardContent className="p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-4">Comment s'est passé votre trajet ?</p>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${(hoveredStar || rating) >= star ? 'text-yellow-500 fill-current' : 'text-muted-foreground/30'}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating === 1 && 'Décevant'}
              {rating === 2 && 'Peut mieux faire'}
              {rating === 3 && 'Correct'}
              {rating === 4 && 'Très bien'}
              {rating === 5 && 'Excellent !'}
            </p>
          </RFCardContent>
        </RFCard>

        {/* Tags */}
        {rating > 0 && (
          <RFCard>
            <RFCardContent className="p-5">
              <p className="text-sm font-medium text-foreground mb-3">Qu'avez-vous apprécié ?</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-brand-blue text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <RFSeparator className="my-4" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Commentaire (optionnel)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Partagez votre expérience..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
            </RFCardContent>
          </RFCard>
        )}
      </div>

      {rating > 0 && (
        <div className="p-4 pb-safe bg-card border-t border-border">
          <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => setSubmitted(true)}>
            Envoyer mon avis
          </RFButton>
        </div>
      )}
    </div>
  );
}
