

# Plan — Backend complet : tout connecter au backend

Je connecte les dernières pages mockées au backend Supabase, j'ajoute la logique métier qui manque (acceptation de réservation → décrément des places, notifications automatiques), je crée l'Edge Function de notifications push, et je rends les pages restantes (Settings, IdentityVerification, PaymentMethods) entièrement fonctionnelles.

---

## 1. MessagesPage — liste de conversations réelles

**Problème :** liste hardcodée + InlineChat avec messages mock.

**Solution :**
- Nouveau hook `useConversations()` qui interroge `messages` pour l'utilisateur courant et regroupe par interlocuteur (dernier message, count non lus, jointure profil).
- Souscription Realtime sur `messages` pour rafraîchir la liste à chaque nouveau message.
- Suppression de l'`InlineChat` mock → réutilisation du composant `ChatPage` directement dans le split desktop.
- Recherche fonctionnelle (filtre par nom).
- Au clic sur conversation : marque les messages reçus comme `read_at = now()`.

---

## 2. MyTripsPage — vraies réservations + trajets

**Problème :** données hardcodées.

**Solution :**
- Adaptation selon le mode utilisateur (`useUserMode`) :
  - **Passager :** charge `bookings` joints à `trips` + `profiles` (chauffeur).
  - **Chauffeur :** charge ses propres `trips` directement.
- Onglet "À venir" : `departure_date >= today` ; "Historique" : sinon.
- Bouton "Annuler" sur trajets pending/confirmed (update status `cancelled`).
- Bouton "Noter" navigue vers `rating` avec `tripId` + `toUserId`.
- Affichage du status réel depuis la base.

---

## 3. BookingRequestsPage — backend complet

**Problème :** liste hardcodée + actions purement locales.

**Solution :**
- Charge les `bookings` reçues sur les trips du chauffeur courant (jointure `bookings → trips → profiles passager`).
- Onglets : "En attente" (`status='pending'`) / "Traitées" (`accepted`/`rejected`/`cancelled`).
- **Accepter** : trigger SQL côté serveur qui décrémente `seats_available` du trip + crée une notification pour le passager. Côté client : `updateBookingStatus(id, 'accepted')`.
- **Refuser** : `updateBookingStatus(id, 'rejected')` + notification au passager.
- Refus si plus de sièges dispo : message d'erreur.

---

## 4. Migration SQL — logique métier serveur

Une nouvelle migration ajoute :

- **Trigger `on_booking_status_change`** sur `bookings` (AFTER UPDATE) :
  - Si `accepted` → décrémente `seats_available` du trip, crée notification passager.
  - Si `rejected` ou `cancelled` (depuis `accepted`) → ré-incrémente les places, notification passager.
- **Trigger `on_booking_created`** sur `bookings` (AFTER INSERT) → notification au chauffeur.
- **Trigger `on_message_created`** sur `messages` (AFTER INSERT) → notification au receveur (type `message`).
- **Trigger `notify_push_on_notification`** sur `notifications` (AFTER INSERT) → appelle l'Edge Function `send-push-notification` via `pg_net` (HTTP).
- Politique RLS supplémentaire : autoriser `INSERT` sur `notifications` quand `auth.uid() != user_id` mais via fonctions security definer (corrige le besoin actuel où passager doit pouvoir notifier le chauffeur).
  - Plus simple : créer une fonction `create_notification(user_id, title, body, type, data)` SECURITY DEFINER, appelée par les triggers.

---

## 5. Edge Function `send-push-notification`

- Lit le payload `{ user_id, title, body, data }`.
- Charge les `push_subscriptions` de l'utilisateur via service role.
- Envoie via Web Push API (lib `npm:web-push`) avec les clés VAPID.
- **Secrets requis** : `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` → je demanderai à l'utilisateur de les ajouter.
- CORS configuré pour appel depuis pg_net et le client.

## 6. usePushNotifications — finaliser l'abonnement client

- Utiliser la `VAPID_PUBLIC_KEY` (publique) exposée via une variable env `VITE_VAPID_PUBLIC_KEY`.
- Au login, demander permission, créer la subscription avec la clé VAPID, stocker dans `push_subscriptions`.
- Hook appelé une fois dans `Index.tsx` après authentification.

---

## 7. SettingsPage — préférences persistées

- Ajouter colonnes `notif_push`, `notif_email`, `notif_sms`, `dark_mode`, `language` sur `profiles`.
- Charger/sauvegarder via `updateProfile`.
- "Supprimer mon compte" : confirmation modal + appel Edge Function `delete-account` (SECURITY DEFINER) qui supprime profil + auth.users.

## 8. PaymentMethodsPage — table `payment_methods`

- Nouvelle table `payment_methods` (user_id, type, last4, expiry, is_default, brand, stripe_payment_method_id nullable).
- CRUD complet avec RLS owner-only.
- Pour l'instant on stocke des cartes de démo (pas de Stripe Connect tant que non explicitement demandé) — UI fonctionnelle, données persistées.

## 9. IdentityVerificationPage — table `identity_documents`

- Nouvelle table `identity_documents` (user_id, type enum: id_card/selfie/phone/license, status enum: pending/verified/rejected, file_url, uploaded_at).
- Bucket storage `identity-docs` privé avec RLS owner-only.
- Upload réel des photos (carte d'ident, selfie, permis). Status par défaut `pending`.
- Affichage du % de vérification = ratio docs verified / requis.

## 10. DriverDashboard — persistance disponibilité

- Nouvelle table `driver_availability` (user_id PK, is_available, lat, lng, radius_km, available_until, updated_at).
- Toggle "Activer mode dispo" upsert dans cette table avec position GPS.
- Slider rayon + heure de fin sauvegardés en temps réel (debounce).
- Page `SearchPage` peut interroger cette table en mode "Dispo maintenant" pour afficher les chauffeurs réellement actifs.

## 11. ChatPage — bouton WhatsApp conditionnel

- Charger le profil de l'autre utilisateur pour vérifier `show_whatsapp` + `whatsapp_number`.
- Afficher le bouton WhatsApp uniquement si activé, sinon le masquer.
- Bouton appel : utilise le `phone` réel du profil (masqué si non renseigné).

## 12. NotificationsSheet — badge unreadCount

- Déjà connecté à `useNotifications` ✅ — vérifier juste l'affichage du badge.

## 13. PublishRequestPage — déjà branché ✅
## 14. AuthPage — déjà branché ✅, mais ajouter écran de sélection mode après inscription (passager par défaut)

---

## Fichiers à créer

- `src/hooks/useConversations.ts`
- `src/hooks/useDriverAvailability.ts`
- `src/hooks/usePaymentMethods.ts`
- `src/hooks/useIdentityVerification.ts`
- `supabase/functions/send-push-notification/index.ts`
- `supabase/functions/delete-account/index.ts`
- Migration SQL : triggers métier + tables `payment_methods`, `identity_documents`, `driver_availability` + colonnes prefs sur `profiles`

## Fichiers à modifier

- `src/pages/MessagesPage.tsx`, `MyTripsPage.tsx`, `BookingRequestsPage.tsx`
- `src/pages/SettingsPage.tsx`, `PaymentMethodsPage.tsx`, `IdentityVerificationPage.tsx`
- `src/pages/DriverDashboard.tsx`, `ChatPage.tsx`
- `src/hooks/usePushNotifications.ts` (clé VAPID réelle)
- `src/pages/Index.tsx` (appeler `usePushNotifications` après auth)
- `src/types/database.ts` (nouveaux types)

## Secrets à demander

- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (pour Web Push) — je peux les générer côté serveur via Edge Function de bootstrap si tu préfères.

## Ordre d'exécution

1. Migration SQL (triggers métier + nouvelles tables + colonnes prefs)
2. MessagesPage (useConversations + Realtime)
3. MyTripsPage (passager + chauffeur)
4. BookingRequestsPage (vraies bookings + accepter/refuser)
5. DriverDashboard (driver_availability)
6. SettingsPage + PaymentMethodsPage + IdentityVerificationPage
7. ChatPage (WhatsApp conditionnel + appel téléphone réel)
8. Edge Function send-push-notification + secrets VAPID
9. usePushNotifications branché complètement
10. AuthPage : sélection mode après inscription

