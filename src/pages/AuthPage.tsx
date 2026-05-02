import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Star, Loader2 } from 'lucide-react';
import { RFButton } from '../components/rideflex/RFButton';
import { RFInput } from '../components/rideflex/RFInput';
import { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent } from '../components/rideflex/RFTabs';
import { RFSeparator } from '../components/rideflex/RFSeparator';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { lovable } from '../integrations/lovable/index';
import logoImg from '../assets/logo.png';

interface AuthPageProps {
  navigate: (page: string) => void;
}

export function AuthPage({ navigate }: AuthPageProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) {
      toast({ title: 'Erreur de connexion', description: error.message, variant: 'destructive' });
    } else {
      navigate('home');
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs.', variant: 'destructive' });
      return;
    }
    if (registerPassword.length < 6) {
      toast({ title: 'Mot de passe trop court', description: 'Minimum 6 caractères.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signUp(registerEmail, registerPassword, registerName);
    setLoading(false);
    if (error) {
      toast({ title: 'Erreur d\'inscription', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Compte créé !', description: 'Vérifiez votre email pour confirmer votre compte.' });
      navigate('home');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setLoading(true);
    const { error } = await resetPassword(forgotEmail);
    setLoading(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Email envoyé', description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.' });
      setShowForgot(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast({ title: 'Erreur Google', description: String(result.error), variant: 'destructive' });
      return;
    }
    if (result.redirected) return;
    setLoading(false);
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-card flex flex-col lg:flex-row">
      {/* Desktop: left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 -left-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-20 w-32 h-32 rounded-full bg-white/5" />
        <svg className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-10" viewBox="0 0 800 120" preserveAspectRatio="none">
          <path d="M0 80 Q200 40 400 80 Q600 120 800 60 L800 120 L0 120Z" fill="white" />
          <line x1="100" y1="90" x2="250" y2="70" stroke="white" strokeWidth="3" strokeDasharray="15 10" opacity="0.5" />
          <line x1="400" y1="80" x2="550" y2="90" stroke="white" strokeWidth="3" strokeDasharray="15 10" opacity="0.5" />
          <line x1="650" y1="75" x2="750" y2="65" stroke="white" strokeWidth="3" strokeDasharray="15 10" opacity="0.5" />
        </svg>
        <div className="text-center text-primary-foreground max-w-md relative z-10">
          <img src={logoImg} alt="RideFlex" className="w-20 h-20 mx-auto mb-6 rounded-2xl" />
          <h1 className="text-5xl font-bold mb-4">RideFlex</h1>
          <p className="text-xl text-primary-foreground/90 mb-2">Le covoiturage réinventé</p>
          <p className="text-primary-foreground/70 mb-8">Rejoignez des milliers d'utilisateurs qui partagent leurs trajets chaque jour.</p>
          <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-5 py-2.5 mb-6">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-yellow-400 fill-current' : 'text-yellow-400/50 fill-current'}`} />
              ))}
            </div>
            <span className="text-sm font-semibold">4.8/5</span>
            <span className="text-xs text-primary-foreground/70 ml-1">• 12k+ avis</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3"><p className="text-2xl font-bold">50k+</p><p className="text-xs text-primary-foreground/70">Utilisateurs</p></div>
            <div className="bg-white/10 rounded-xl p-3"><p className="text-2xl font-bold">120k+</p><p className="text-xs text-primary-foreground/70">Trajets</p></div>
            <div className="bg-white/10 rounded-xl p-3"><p className="text-2xl font-bold">35+</p><p className="text-xs text-primary-foreground/70">Villes</p></div>
          </div>
          <p className="text-primary-foreground/40 text-xs mt-10">© 2026 RideFlex. Tous droits réservés.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 pt-12 lg:pt-6 pb-4 lg:hidden">
          <button onClick={() => navigate('onboarding')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
        </div>
        <div className="hidden lg:flex px-6 pt-6">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 px-6 flex flex-col justify-center pb-20 lg:pb-8 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-brand mb-2 lg:hidden">RideFlex</h1>
            <h1 className="text-3xl font-bold text-foreground mb-2 hidden lg:block">Bienvenue</h1>
            <p className="text-muted-foreground">Rejoignez la communauté du covoiturage</p>
          </div>

          {showForgot ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Mot de passe oublié</h2>
              <p className="text-sm text-muted-foreground">Entrez votre email pour recevoir un lien de réinitialisation.</p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <RFInput placeholder="Adresse email" type="email" className="pl-10 h-12" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <RFButton variant="brand" size="xl" className="w-full" onClick={handleForgotPassword} disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer le lien'}
              </RFButton>
              <button onClick={() => setShowForgot(false)} className="text-sm text-primary font-medium w-full text-center">Retour à la connexion</button>
            </div>
          ) : (
            <RFTabs defaultValue="login" className="w-full">
              <RFTabsList className="grid w-full grid-cols-2 mb-8">
                <RFTabsTrigger value="login">Connexion</RFTabsTrigger>
                <RFTabsTrigger value="register">Inscription</RFTabsTrigger>
              </RFTabsList>

              <RFTabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <RFInput placeholder="Adresse email" type="email" className="pl-10 h-12" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <RFInput placeholder="Mot de passe" type="password" className="pl-10 h-12" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                <div className="text-right">
                  <button onClick={() => setShowForgot(true)} className="text-sm text-primary font-medium">Mot de passe oublié ?</button>
                </div>
                <RFButton variant="brand" size="xl" className="w-full mt-4" onClick={handleLogin} disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Se connecter'}
                </RFButton>
              </RFTabsContent>

              <RFTabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <RFInput placeholder="Nom complet" className="pl-10 h-12" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <RFInput placeholder="Adresse email" type="email" className="pl-10 h-12" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <RFInput placeholder="Mot de passe" type="password" className="pl-10 h-12" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  En créant un compte, vous êtes à la fois passager et chauffeur.
                </p>
                <RFButton variant="brand" size="xl" className="w-full mt-6" onClick={handleRegister} disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer un compte'}
                </RFButton>
              </RFTabsContent>
            </RFTabs>
          )}
        </div>
      </div>
    </div>
  );
}
