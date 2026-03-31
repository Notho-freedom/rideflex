import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';

interface OnboardingPageProps {
  navigate: (page: string) => void;
}

const slides = [
  {
    title: 'Trouvez votre trajet',
    desc: 'Recherchez parmi des milliers de trajets proposés par des chauffeurs vérifiés, partout en France.',
    illustration: (
      <svg viewBox="0 0 240 200" className="w-full max-w-[240px] h-auto">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(214 100% 50%)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(168 100% 39%)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="120" cy="100" r="80" fill="url(#grad1)" opacity="0.1" />
        <circle cx="120" cy="100" r="55" fill="url(#grad1)" opacity="0.15" />
        {/* Magnifying glass */}
        <circle cx="110" cy="90" r="28" stroke="url(#grad1)" strokeWidth="4" fill="none" />
        <line x1="130" y1="110" x2="150" y2="130" stroke="url(#grad1)" strokeWidth="4" strokeLinecap="round" />
        {/* Map pin inside */}
        <path d="M110 78 C110 78 100 88 100 94 C100 100 105 104 110 104 C115 104 120 100 120 94 C120 88 110 78 110 78Z" fill="url(#grad1)" opacity="0.7" />
        <circle cx="110" cy="93" r="3" fill="white" />
        {/* Decorative dots */}
        <circle cx="50" cy="50" r="4" fill="hsl(214 100% 50%)" opacity="0.3" />
        <circle cx="190" cy="60" r="3" fill="hsl(168 100% 39%)" opacity="0.4" />
        <circle cx="170" cy="150" r="5" fill="hsl(214 100% 50%)" opacity="0.2" />
        <circle cx="60" cy="160" r="3" fill="hsl(168 100% 39%)" opacity="0.3" />
      </svg>
    ),
  },
  {
    title: 'Publiez et partagez',
    desc: 'Proposez vos trajets en quelques clics. Définissez vos arrêts, votre prix et partagez la route.',
    illustration: (
      <svg viewBox="0 0 240 200" className="w-full max-w-[240px] h-auto">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(214 100% 50%)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(168 100% 39%)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="120" cy="100" r="80" fill="url(#grad2)" opacity="0.1" />
        {/* Car body */}
        <rect x="65" y="85" rx="12" ry="12" width="110" height="40" fill="url(#grad2)" opacity="0.8" />
        <rect x="80" y="70" rx="8" ry="8" width="70" height="25" fill="url(#grad2)" opacity="0.6" />
        {/* Wheels */}
        <circle cx="95" cy="125" r="10" fill="hsl(220 20% 20%)" />
        <circle cx="95" cy="125" r="5" fill="hsl(220 14% 96%)" />
        <circle cx="155" cy="125" r="10" fill="hsl(220 20% 20%)" />
        <circle cx="155" cy="125" r="5" fill="hsl(220 14% 96%)" />
        {/* Share arrows */}
        <path d="M175 65 L195 55 L195 75 Z" fill="hsl(168 100% 39%)" opacity="0.6" />
        <line x1="160" y1="65" x2="175" y2="65" stroke="hsl(168 100% 39%)" strokeWidth="2" opacity="0.6" />
        <path d="M175 50 L195 40 L195 60 Z" fill="hsl(214 100% 50%)" opacity="0.4" />
        <line x1="165" y1="50" x2="175" y2="50" stroke="hsl(214 100% 50%)" strokeWidth="2" opacity="0.4" />
        {/* Road lines */}
        <line x1="40" y1="145" x2="70" y2="145" stroke="hsl(220 13% 91%)" strokeWidth="3" strokeDasharray="8 4" />
        <line x1="170" y1="145" x2="200" y2="145" stroke="hsl(220 13% 91%)" strokeWidth="3" strokeDasharray="8 4" />
      </svg>
    ),
  },
  {
    title: 'Voyagez en confiance',
    desc: 'Profils vérifiés, avis communautaires et paiements sécurisés pour des trajets en toute sérénité.',
    illustration: (
      <svg viewBox="0 0 240 200" className="w-full max-w-[240px] h-auto">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(214 100% 50%)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(168 100% 39%)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="120" cy="100" r="80" fill="url(#grad3)" opacity="0.1" />
        <circle cx="120" cy="100" r="55" fill="url(#grad3)" opacity="0.08" />
        {/* Shield */}
        <path d="M120 45 L160 65 L160 105 C160 135 140 155 120 165 C100 155 80 135 80 105 L80 65 Z" fill="url(#grad3)" opacity="0.2" stroke="url(#grad3)" strokeWidth="2" />
        {/* Checkmark */}
        <path d="M100 100 L115 115 L145 80" stroke="url(#grad3)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Stars */}
        <polygon points="50,55 53,47 56,55 49,50 57,50" fill="hsl(45 100% 51%)" opacity="0.6" />
        <polygon points="185,70 188,62 191,70 184,65 192,65" fill="hsl(45 100% 51%)" opacity="0.5" />
        <polygon points="65,155 68,147 71,155 64,150 72,150" fill="hsl(45 100% 51%)" opacity="0.4" />
      </svg>
    ),
  },
];

export function OnboardingPage({ navigate }: OnboardingPageProps) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div className="min-h-screen bg-card flex flex-col lg:flex-row">
      {/* Desktop: branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-md">
          <h1 className="text-5xl font-bold mb-4">RideFlex</h1>
          <p className="text-xl text-primary-foreground/90 mb-2">Le covoiturage réinventé</p>
          <p className="text-primary-foreground/70 text-sm">Simple, économique et convivial.</p>
          <p className="text-primary-foreground/50 text-xs mt-8">© 2026 RideFlex. Tous droits réservés.</p>
        </div>
      </div>

      {/* Slide panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full text-center">
          {/* Illustration */}
          <div className="flex justify-center mb-8">
            {slide.illustration}
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-foreground mb-3">{slide.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{slide.desc}</p>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-gradient-brand' : 'w-2 bg-muted-foreground/30'}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-4">
            {current > 0 ? (
              <RFButton variant="outline" onClick={() => setCurrent(current - 1)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" />Précédent
              </RFButton>
            ) : (
              <button onClick={() => navigate('auth')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Passer
              </button>
            )}

            {isLast ? (
              <RFButton variant="brand" size="xl" onClick={() => navigate('auth')} className="flex-1">
                Commencer
              </RFButton>
            ) : (
              <RFButton variant="brand" onClick={() => setCurrent(current + 1)} className="flex-1">
                Suivant<ChevronRight className="w-4 h-4 ml-1" />
              </RFButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
