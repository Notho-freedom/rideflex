
# Plan -- Finitions : derniers éléments non connectés au backend

Apres audit complet du code, la majorite des pages sont deja connectees au backend. Il reste quelques points a corriger :

---

## 1. BookingConfirmation -- prix dynamiques depuis le vrai trajet

**Probleme :** Les prix sont hardcodes (21,00 EUR, 25,00 EUR). Le bouton "Payer" ne fait que `setIsConfirmed(true)` sans aucune interaction backend.

**Solution :**
- Charger le trajet reel via `tripId` (query Supabase).
- Calculer le prix dynamiquement : prix du trajet + frais de service (ex. 15% commission plateforme).
- Au clic sur "Payer", creer la reservation via `useBookings.createBooking()` puis afficher la confirmation.
- Passer `seats` et `tripId` depuis `TripDetailPage` via `pageData`.

---

## 2. TripDetailPage -- supprimer le fallback mock

**Probleme :** Quand `tripId` est absent, un mock Paris-Lyon avec "Sophie M." s'affiche (lignes 37-46).

**Solution :**
- Si pas de `tripId`, afficher un message "Trajet introuvable" avec bouton retour, au lieu de fausses donnees.

---

## 3. Google OAuth sur AuthPage

**Probleme :** Pas de connexion Google. Seul email/password est disponible.

**Solution :**
- Ajouter `signInWithGoogle()` dans `AuthContext` via `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- Ajouter un bouton "Continuer avec Google" sur la page de connexion et d'inscription.
- Configurer le provider Google via `cloud--configure_auth`.

---

## 4. Notifications insert policy

**Probleme potentiel :** Les triggers serveur creent des notifications (via `create_notification` SECURITY DEFINER), mais il manque peut-etre une policy INSERT sur `notifications` pour les cas ou le client devrait aussi pouvoir en creer.

**Solution :** Verifier et ajouter si necessaire une policy permettant l'insertion de notifications par le systeme (les triggers fonctionnent deja en SECURITY DEFINER, donc probablement OK).

---

## Fichiers modifies

- `src/pages/BookingConfirmation.tsx` -- prix dynamiques + creation booking reelle
- `src/pages/TripDetailPage.tsx` -- supprimer fallback mock, passer seats au navigate
- `src/pages/Index.tsx` -- passer seats dans pageData pour booking-confirmation
- `src/contexts/AuthContext.tsx` -- ajouter `signInWithGoogle`
- `src/pages/AuthPage.tsx` -- bouton Google OAuth
- Migration SQL si policy notifications manquante

## Ordre

1. BookingConfirmation dynamique + TripDetailPage cleanup
2. Google OAuth (AuthContext + AuthPage + config)
3. Verification policies notifications
