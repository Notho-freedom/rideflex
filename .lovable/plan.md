

# Plan — Développement intégral du backend RideFlex

## Etat actuel

- **Client Supabase** : configuré (`src/integrations/supabase/client.ts`)
- **AuthContext** : existe, fonctionnel avec `signUp`/`signIn`/`signOut`
- **Hooks** : `useProfile`, `useTrips`, `useBookings`, `useMessages`, `useNotifications` — tous codés et prêts mais les tables Supabase n'existent pas encore
- **Types** : `src/types/database.ts` complet
- **Service Worker** : `public/sw.js` basique en place
- **Pages** : toutes utilisent des données mockées (hardcoded arrays)
- **Aucune table Supabase** n'existe — la base de données est vide
- **Aucun dossier `supabase/`** n'existe (pas de config.toml, pas de migrations, pas d'edge functions)

---

## Ce qui doit être fait

### 1. Initialiser l'infrastructure Supabase (migrations SQL)

Créer `supabase/config.toml` et les migrations pour toutes les tables :

**Tables à créer :**
- `profiles` (id = auth.users.id, full_name, avatar_url, phone, bio, is_driver, vehicle_*, rating_avg, total_trips, whatsapp_number, show_whatsapp)
- `user_roles` (user_id, role enum admin/moderator/user)
- `trips` (driver_id, from/to city+address+lat/lng, stops jsonb, departure_date/time, price, seats_total/available, status, accepts_luggage/animals, is_recurring, recurrence_pattern, return_trip_id, estimated_arrival_time)
- `trip_requests` (publisher_id, from/to city, desired_date/time, proposed_price, seats_needed, accepts_luggage/animals, is_private, status)
- `bookings` (trip_id, passenger_id, status, seats, message, is_private, total_price, platform_fee, driver_payout)
- `messages` (sender_id, receiver_id, trip_id, content, read_at)
- `notifications` (user_id, title, body, type, data jsonb, read)
- `ratings` (trip_id, from_user_id, to_user_id, score, tags, comment)
- `push_subscriptions` (user_id, endpoint, keys jsonb)

**Sécurité :**
- `has_role()` security definer function
- RLS sur chaque table
- Trigger `handle_new_user()` pour auto-créer un profil à l'inscription
- Enable Realtime sur `messages` et `notifications`

### 2. Brancher AuthPage sur le vrai backend

- Connecter les inputs email/password aux fonctions `signIn`/`signUp` de `useAuth`
- Ajouter les états de chargement et gestion d'erreurs (toast)
- Ajouter le flow de mot de passe oublié
- Protéger les routes : rediriger vers `auth` si non connecté (dans `Index.tsx`)
- Après inscription, rediriger vers sélection de mode (passager/chauffeur)

### 3. Brancher ProfilePage + EditProfilePage

- Utiliser `useProfile` pour charger/sauvegarder le vrai profil
- Upload d'avatar vers Supabase Storage
- Afficher les vraies données (nom, téléphone, véhicule, etc.)

### 4. Brancher PublishPage sur `useTrips.createTrip`

- Collecter toutes les données du formulaire (départ, arrivée, arrêts, date, heure, prix, sièges, options)
- Appeler `geocode()` + `getRoute()` pour calculer les coordonnées et l'heure d'arrivée
- Insérer le trajet en base via `useTrips.createTrip`
- Gérer aller-retour (créer 2 trajets liés)

### 5. Brancher SearchPage sur `useTrips.fetchTrips`

- Remplacer le tableau mock par des requêtes Supabase réelles
- Filtres dynamiques : ville, date, bagages, animaux, dispo maintenant
- Joindre les profils des chauffeurs pour afficher nom/rating
- Mode carte : afficher les vrais marqueurs depuis les coordonnées lat/lng

### 6. Brancher TripDetailPage

- Charger un trajet par ID depuis Supabase
- Charger le profil du chauffeur
- Bouton "Réserver" → `useBookings.createBooking`
- Carte Mapbox avec le vrai itinéraire

### 7. Brancher MyTripsPage + BookingRequestsPage

- `MyTripsPage` : charger les réservations du passager (bookings + trips joints)
- `BookingRequestsPage` : charger les réservations reçues par le chauffeur
- Actions accepter/refuser via `useBookings.updateBookingStatus`

### 8. Brancher MessagesPage + ChatPage

- Liste des conversations : requête distincte sur `messages` groupé par interlocuteur
- Chat : utiliser `useMessages` (déjà Realtime) avec le vrai `otherUserId`
- Envoyer des messages via `sendMessage`

### 9. Brancher NotificationsSheet + NotificationsPage

- Utiliser `useNotifications` (déjà Realtime) pour charger les vraies notifications
- Afficher le `unreadCount` sur l'icône de notification
- Mark as read au clic
- Navigation vers l'élément concerné (trip-detail, chat, etc.)

### 10. Brancher PublishRequestPage + TripRequestsPage

- `PublishRequestPage` : insérer dans `trip_requests`
- `TripRequestsPage` : charger les demandes actives avec profil du passager

### 11. Brancher DriverDashboard (Mode Dispo)

- Sauvegarder la position GPS et le rayon en base (nouveau champ ou table)
- Requête pour trouver les chauffeurs disponibles dans un rayon

### 12. Brancher RatingPage

- Insérer une note dans `ratings`
- Mettre à jour `rating_avg` du profil via trigger ou calcul

### 13. Edge Function — Notifications push

- Créer `supabase/functions/send-push-notification/index.ts`
- Recevoir un payload (user_id, title, body)
- Chercher les subscriptions push de l'utilisateur
- Envoyer via Web Push API
- Créer un trigger SQL sur `INSERT INTO notifications` qui appelle cette fonction

### 14. Push Subscription côté client

- Après login, demander la permission de notification
- Enregistrer la subscription dans `push_subscriptions`
- Mettre à jour `sw.js` avec l'icône du logo

---

## Fichiers à créer

- `supabase/config.toml`
- `supabase/migrations/00001_initial_schema.sql` (toutes les tables, RLS, triggers)
- `supabase/functions/send-push-notification/index.ts`
- `src/hooks/useTripRequests.ts`
- `src/hooks/useRatings.ts`
- `src/hooks/usePushNotifications.ts` (gestion subscription côté client)

## Fichiers à modifier

- `src/pages/AuthPage.tsx` — brancher signIn/signUp réels + gestion erreurs
- `src/pages/Index.tsx` — protection des routes (auth guard)
- `src/pages/HomePage.tsx` — charger les trajets récents depuis Supabase
- `src/pages/SearchPage.tsx` — remplacer mock par `useTrips.fetchTrips`
- `src/pages/PublishPage.tsx` — brancher `createTrip`
- `src/pages/TripDetailPage.tsx` — charger trajet + chauffeur réels
- `src/pages/MyTripsPage.tsx` — brancher `useBookings`
- `src/pages/BookingRequestsPage.tsx` — brancher `useBookings`
- `src/pages/MessagesPage.tsx` — brancher conversations réelles
- `src/pages/ChatPage.tsx` — brancher `useMessages`
- `src/pages/ProfilePage.tsx` — brancher `useProfile`
- `src/pages/EditProfilePage.tsx` — brancher `updateProfile`
- `src/pages/PublishRequestPage.tsx` — brancher insert `trip_requests`
- `src/pages/TripRequestsPage.tsx` — brancher select `trip_requests`
- `src/pages/DriverDashboard.tsx` — position GPS réelle + rayon
- `src/pages/RatingPage.tsx` — brancher insert `ratings`
- `src/pages/NotificationsPage.tsx` — brancher `useNotifications`
- `src/components/rideflex/NotificationsSheet.tsx` — brancher `useNotifications`
- `public/sw.js` — mettre à jour l'icône

## Ordre d'exécution

1. Migration SQL (toutes les tables + RLS + triggers)
2. Auth (AuthPage branché + route guard)
3. Profile (ProfilePage + EditProfilePage)
4. Trips (PublishPage + SearchPage + TripDetailPage)
5. Bookings (MyTripsPage + BookingRequestsPage + BookingConfirmation)
6. Messages (MessagesPage + ChatPage)
7. Notifications in-app (NotificationsSheet + NotificationsPage)
8. Trip Requests (PublishRequestPage + TripRequestsPage)
9. Ratings (RatingPage)
10. Driver Dashboard (position + rayon)
11. Push notifications (Edge Function + client subscription)

