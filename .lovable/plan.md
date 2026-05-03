
# Plan -- Intégration Stripe et finitions

Apres audit complet, toutes les pages sont connectées au backend, les triggers fonctionnent, Google OAuth est actif. Le dernier manque critique : le bouton "Payer" dans BookingConfirmation ne fait rien de réel (juste `setIsConfirmed(true)`).

---

## 1. Activer Stripe via Lovable Payments

- Utiliser l'intégration Stripe native de Lovable pour accepter les paiements.
- Creer une Edge Function `create-checkout` qui :
  - Recoit `booking_id`
  - Charge le booking + trip pour calculer le montant
  - Cree une Stripe Checkout Session avec le montant total (prix + 15% commission)
  - Retourne l'URL de redirection Stripe

## 2. Edge Function `stripe-webhook`

- Ecoute l'event `checkout.session.completed`
- Met a jour le booking avec `status = 'paid'`, `total_price`, `platform_fee`, `driver_payout`
- Envoie une notification au chauffeur

## 3. BookingConfirmation -- vrai paiement

- Au clic sur "Payer", appeler `create-checkout` et rediriger vers Stripe
- Ajouter une page de retour (`/success`) qui affiche la confirmation
- Gerer le cas "espèces" : marquer le booking comme `accepted` sans paiement en ligne

## 4. Derniere finition : BookingConfirmation sans tripId

- Si `tripId` est absent, afficher "Réservation introuvable" au lieu d'un résumé vide (prix 0.00 EUR)

---

## Fichiers modifies

- `supabase/functions/create-checkout/index.ts` (nouveau)
- `supabase/functions/stripe-webhook/index.ts` (nouveau)
- `src/pages/BookingConfirmation.tsx` -- appel Stripe + fallback espèces
- `src/pages/Index.tsx` -- route retour Stripe si necessaire
- Migration SQL si colonnes manquantes sur bookings

## Ordre

1. Activer Stripe (outil payments)
2. Creer les Edge Functions
3. Mettre a jour BookingConfirmation
4. Tester le flux complet
