import React from 'react';
import { ArrowLeft, MapPin, Clock, ShieldCheck, MessageCircle, Star, Info } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFCard, RFCardContent } from '../components/rideflex/RFCard';
import { RFAvatar, RFAvatarImage, RFAvatarFallback } from '../components/rideflex/RFAvatar';
import { RFSeparator } from '../components/rideflex/RFSeparator';

interface TripDetailPageProps {
  navigate: (page: string, data?: any) => void;
}

export function TripDetailPage({ navigate }: TripDetailPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card px-4 pt-12 lg:pt-6 pb-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => navigate('search')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-foreground">Détails du trajet</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="max-w-2xl lg:max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6">
          {/* Left column: trip info */}
          <div>
            <div className="bg-card p-6 mb-2 lg:rounded-xl lg:shadow-sm lg:mb-4">
              <h2 className="text-xl font-bold text-foreground mb-6">Aujourd'hui</h2>
              <div className="relative pl-6 border-l-2 border-border space-y-8 ml-2">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 bg-card border-4 border-brand-blue rounded-full"></div>
                  <p className="text-lg font-bold text-foreground">14:30</p>
                  <p className="text-base font-medium text-foreground">Paris</p>
                  <p className="text-sm text-muted-foreground mt-1">Gare de Lyon, Hall 1</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 bg-brand-teal rounded-full"></div>
                  <p className="text-lg font-bold text-foreground">18:00</p>
                  <p className="text-base font-medium text-foreground">Lyon</p>
                  <p className="text-sm text-muted-foreground mt-1">Gare Part-Dieu</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 mb-2 flex justify-between items-center lg:rounded-xl lg:shadow-sm lg:mb-4">
              <span className="text-muted-foreground font-medium">Prix total pour 1 passager</span>
              <span className="text-2xl font-bold text-brand-blue">25,00 €</span>
            </div>
          </div>

          {/* Right column: driver info */}
          <div>
            <div className="bg-card p-4 mb-2 lg:rounded-xl lg:shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <RFAvatar className="w-14 h-14">
                    <RFAvatarImage src="https://i.pravatar.cc/150?u=1" />
                    <RFAvatarFallback>SM</RFAvatarFallback>
                  </RFAvatar>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Sophie M.</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="font-medium mr-1">4.9</span><span>(42 avis)</span>
                    </div>
                  </div>
                </div>
                <button className="p-3 bg-primary/10 text-brand-blue rounded-full" onClick={() => navigate('chat')}>
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>
              <RFSeparator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center text-foreground"><ShieldCheck className="w-5 h-5 text-brand-teal mr-3" /><span className="text-sm">Identité vérifiée</span></div>
                <div className="flex items-center text-foreground"><Info className="w-5 h-5 text-muted-foreground mr-3" /><span className="text-sm">Peugeot 208 • Blanche</span></div>
              </div>
            </div>

            {/* Desktop: CTA inside content */}
            <div className="hidden lg:block mt-4">
              <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => navigate('booking-confirmation')}>Continuer</RFButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-safe z-50 lg:hidden">
        <RFButton variant="brand" size="xl" className="w-full shadow-lg" onClick={() => navigate('booking-confirmation')}>Continuer</RFButton>
      </div>
    </div>
  );
}
