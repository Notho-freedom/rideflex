

# Plan de développement RideFlex — Responsive + Backend + Notifications

## Résumé des demandes

1. **Adaptation responsive** : Transformer le design mobile-first en layout adaptatif pour desktop (sidebar + contenu centré), tablette (contenu centré plus large), et mobile (inchangé)
2. **Backend Supabase** : Auth, profils, trajets, réservations, messages, notifications
3. **Notifications push** : Service Worker + notifications in-app temps réel via Supabase Realtime

---

## Phase 1 — Adaptation responsive (prioritaire)

### Stratégie de layout

```text
Mobile (<768px)          Tablette (768-1024px)      Desktop (>1024px)
┌──────────────┐         ┌───────────────────┐      ┌──────┬────────────────┐
│   Content    │         │    Content         │      │ Side │    Content     │
│   Full width │         │    max-w-2xl       │      │ Nav  │  max-w-4xl     │
│              │         │    centered        │      │      │  centered      │
├──────────────┤         ├───────────────────┤      │      │               │
│  BottomNav   │         │    BottomNav       │      │      │               │
└──────────────┘         └───────────────────┘      └──────┴────────────────┘
```

### Fichiers modifiés

1. **`src/components/rideflex/SideNav.tsx`** (nouveau) — Navigation latérale desktop avec les mêmes onglets que BottomNav, affichée uniquement sur `lg:` et plus
2. **`src/components/rideflex/BottomNav.tsx`** — Masquer sur `lg:` (`lg:hidden`)
3. **`src/components/rideflex/ResponsiveLayout.tsx`** (nouveau) — Wrapper qui gère le layout : sidebar à gauche sur desktop, contenu centré avec `max-w` adaptatif
4. **`src/pages/Index.tsx`** — Utiliser ResponsiveLayout au lieu du layout brut actuel
5. **Toutes les pages** (~15 fichiers) — Ajouter des classes responsive :
   - `max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto` pour centrer le contenu
   - Grids adaptatifs : `grid-cols-2 lg:grid-cols-3` pour les actions rapides
   - `HomePage` : Hero et search card adaptés, trajets en grid sur desktop
   - `SearchPage` : Liste en 2 colonnes sur desktop
   - `MessagesPage` / `ChatPage` : Layout split-view sur desktop (liste + chat côte à côte)
   - `ProfilePage`, `SettingsPage`, etc. : Contenu centré avec max-width
   - `PublishPage`, `EditProfilePage` : Formulaires centrés, max-w-xl sur desktop
   - Padding `pt-12` → `pt-6 lg:pt-8` (plus de safe area sur desktop)

---

## Phase 2 — Backend Supabase

### Activation Lovable Cloud

Activer Supabase via Lovable Cloud pour obtenir auth + database.

### Schéma de base de données (migrations)

**Table `profiles`** — Données utilisateur
- `id` (uuid, FK auth.users), `full_name`, `avatar_url`, `phone`, `bio`, `is_driver`, `vehicle_brand`, `vehicle_model`, `vehicle_color`, `license_plate`, `rating_avg`, `total_trips`, `created_at`

**Table `user_roles`** — Rôles (admin, user, driver)
- `id`, `user_id` (FK auth.users), `role` (enum)

**Table `trips`** — Trajets publiés
- `id`, `driver_id` (FK profiles), `from_city`, `from_address`, `to_city`, `to_address`, `departure_date`, `departure_time`, `price`, `seats_total`, `seats_available`, `status` (active/completed/cancelled), `created_at`

**Table `bookings`** — Réservations
- `id`, `trip_id` (FK trips), `passenger_id` (FK profiles), `status` (pending/accepted/rejected/cancelled), `created_at`

**Table `messages`** — Messages de chat
- `id`, `sender_id`, `receiver_id`, `trip_id` (nullable), `content`, `read_at`, `created_at`

**Table `notifications`** — Notifications in-app
- `id`, `user_id`, `title`, `body`, `type` (booking/message/trip/system), `data` (jsonb), `read`, `created_at`

**Table `ratings`** — Avis
- `id`, `trip_id`, `from_user_id`, `to_user_id`, `score` (1-5), `tags` (text[]), `comment`, `created_at`

**RLS** sur toutes les tables + fonction `has_role()` security definer.

### Intégration frontend

- **AuthContext** : Provider global avec `onAuthStateChange`, protéger les routes
- **AuthPage** : Brancher `signUp` / `signInWithPassword`
- **ProfilePage** : Lecture/écriture profil depuis Supabase
- **PublishPage** : Insert dans `trips`
- **SearchPage** : Query `trips` avec filtres
- **BookingConfirmation** : Insert dans `bookings`
- **MessagesPage/ChatPage** : Query/insert `messages` + Supabase Realtime pour temps réel
- **NotificationsPage** : Query `notifications` + Realtime subscription
- **RatingPage** : Insert dans `ratings`, mise à jour `rating_avg` du profil
- **Custom hooks** : `useAuth`, `useTrips`, `useMessages`, `useNotifications`, `useProfile`

---

## Phase 3 — Notifications push navigateur

### Architecture

1. **Service Worker** (`public/sw.js`) pour recevoir les push events
2. **Edge Function `send-push-notification`** : Envoie via Web Push API quand un événement survient (nouvelle réservation, nouveau message, etc.)
3. **Table `push_subscriptions`** : Stocke les subscriptions des utilisateurs (endpoint, keys)
4. **Composant de demande de permission** : À afficher après login pour demander l'autorisation de notifications
5. **Triggers Supabase** : Database webhooks ou triggers pour déclencher l'envoi de push quand un insert arrive dans `bookings`, `messages`, etc.

### Secrets nécessaires

- VAPID public/private keys (générées et stockées via Lovable secrets)

---

## Ordre d'exécution

1. Créer `SideNav` + `ResponsiveLayout` → modifier `Index.tsx` + `BottomNav`
2. Adapter chaque page avec classes responsive (par lots)
3. Activer Lovable Cloud / Supabase
4. Créer les migrations (tables + RLS)
5. Créer `AuthContext` + `useAuth` + brancher `AuthPage`
6. Créer les hooks data (`useTrips`, `useProfile`, etc.) + brancher les pages
7. Messages temps réel avec Realtime
8. Notifications in-app avec Realtime
9. Push notifications (Service Worker + Edge Function)

