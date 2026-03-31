

# Plan — Corrections design + Backend Supabase (reprise)

## Contexte

L'utilisateur a déjà connecté son propre projet Supabase avec toutes les clés dans `.env`. Il ne faut pas créer de nouveau projet — utiliser directement les variables existantes (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.). Le responsive (Phase 1) est fait, mais il reste des problèmes de sidebar manquante sur les sous-pages et plusieurs améliorations UX demandées.

---

## Bloc A — Corrections design & UX (prioritaire)

### A1. Sidebar visible sur toutes les pages (desktop/tablette)

**Problème** : `showNav` dans `Index.tsx` ne s'active que pour 5 pages principales. Toutes les sous-pages (settings, driver-dashboard, trip-detail, etc.) n'ont pas de sidebar.

**Solution** : Modifier la logique `showNav` — afficher la nav sur toutes les pages SAUF `auth`, `onboarding`, `booking-confirmation`, `rating`, `chat`. Les pages comme settings, driver-dashboard, my-trips, etc. garderont la sidebar.

### A2. Auth page — Supprimer le choix passager/chauffeur

Retirer le sélecteur de rôle à l'inscription. Tout le monde est passager ET chauffeur par défaut. Ajouter des décorations au panel gauche desktop : note de rating fictive, copyright "© 2026 RideFlex", et des éléments visuels SVG (voiture, route stylisée).

### A3. Onboarding (3 écrans)

Créer `OnboardingPage.tsx` avec 3 slides swipables :
1. "Trouvez votre trajet" — illustration SVG de recherche, texte descriptif
2. "Publiez et partagez" — illustration SVG voiture/partage
3. "Voyagez en confiance" — illustration SVG vérification/sécurité

Bouton "Commencer" à la fin → redirige vers Auth. L'onboarding s'affiche en premier si l'utilisateur n'est pas authentifié.

### A4. Notifications — Panel latéral sur desktop/tablette

Au lieu d'ouvrir une page pleine, utiliser un `Sheet` (composant existant) qui glisse depuis la droite. Chaque notification est cliquable et redirige vers l'élément concerné (réservation, chat, trajet). Sur mobile, garder la page actuelle.

### A5. Actions rapides — Corrections

- Remplacer "Notifications" par "Mes réservations" (avec icône `ClipboardList`)
- Changer l'icône de "Mode Dispo" : remplacer `Search` par `Radio` (icône antenne)
- Ajouter un bouton d'options (3 points) sur les cartes de trajets récents

### A6. Search card sur homepage — Équilibrer le layout

Mettre le bouton "Rechercher" sur la même ligne que les inputs sur desktop (grid 4 colonnes au lieu de 3 + bouton en dessous). Sur mobile, garder le bouton pleine largeur.

### A7. Location overlay pour inputs de lieu

Créer un composant `LocationPicker` réutilisable (utilisé sur homepage et search page) :
- Quand on clique sur un input lieu → overlay/popover avec :
  - "Ma position" (icône GPS)
  - Historique des saisies récentes (stocké en localStorage)
  - Input de saisie libre
- Validation : départ ≠ arrivée
- "Ma position" disponible pour départ ET arrivée

### A8. Search page — Refonte complète

- Remplacer l'en-tête statique "Paris → Lyon" par de vrais inputs de recherche
- 3 modes de recherche via segment control : "Par départ", "Par arrivée", "Par trajet"
  - Par départ/arrivée : un seul input
  - Par trajet : deux inputs (réutilise LocationPicker)
- Retirer le switch Liste/Carte (pas de carte ici)
- Ajouter un filtre "Chauffeur disponible maintenant" dans les filtres

### A9. Publish page — Arrêts intermédiaires + carte interactive

- Ajouter bouton "+ Ajouter un arrêt" entre départ et arrivée (dynamique, plusieurs arrêts)
- Intégrer Mapbox (clé déjà dans `.env`) pour afficher une carte interactive qui trace l'itinéraire départ → arrêts → arrivée en temps réel
- Schéma de sièges du véhicule (layout standard 5 places : conducteur grisé + 4 sélectionnables)

### A10. Driver Dashboard — Mode dispo avec carte

- Retirer l'onglet "Mes Trajets" (déplacé vers actions rapides "Mes réservations")
- Avant activation : carte fictive stylisée (dégradé bleu/brume, illustration SVG, bouton "Activer")
- Après activation : carte Mapbox réelle avec position GPS, marqueur, cercle de rayon
- Panel de configuration à côté/en dessous de la carte avec le slider de rayon qui ajuste le cercle en temps réel

### A11. Chat page — Appel externe + WhatsApp + localisation

- Bouton appel → `window.open('tel:...')` (appel externe)
- Ajouter bouton WhatsApp conditionnel → `window.open('https://wa.me/...')`
- Ajouter bouton partage de localisation dans la barre d'input → envoie un message avec lien Mapbox/Google Maps

### A12. Trip detail page — Carte du trajet + arrêts + suggestion d'arrêt

- Intégrer carte Mapbox montrant l'itinéraire (départ → arrêts → arrivée) tracé
- Afficher les arrêts intermédiaires sur la timeline
- Bouton "Suggérer un arrêt" pour le passager

---

## Bloc B — Backend Supabase (après design)

### B1. Client Supabase

Créer `src/integrations/supabase/client.ts` utilisant `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` depuis `.env` (préfixe `VITE_` pour Vite). Ajouter les variables préfixées dans `.env`.

### B2. Migrations SQL

Créer les migrations pour les tables : `profiles`, `user_roles`, `trips` (avec colonne `stops` jsonb), `bookings`, `messages`, `notifications`, `ratings`, `push_subscriptions`. Toutes avec RLS + fonction `has_role()`.

### B3. Auth

- `AuthContext` + `useAuth` hook
- Brancher `AuthPage` sur `supabase.auth.signUp` / `signInWithPassword`
- Trigger auto-création profil à l'inscription
- Protection des routes (redirection vers auth/onboarding si non connecté)
- Mot de passe oublié + page `/reset-password`

### B4. Hooks data

- `useProfile` : lecture/écriture profil
- `useTrips` : CRUD trajets + recherche avec filtres
- `useBookings` : créer/accepter/refuser réservations
- `useMessages` : envoyer/recevoir + Supabase Realtime
- `useNotifications` : in-app + Realtime subscription

### B5. Notifications push

- Service Worker `public/sw.js`
- Table `push_subscriptions`
- Edge Function `send-push-notification` (Web Push API)
- Demande de permission après login
- Triggers sur insert dans `bookings`/`messages`

---

## Ordre d'exécution

1. A1 (sidebar sur sous-pages) + A2 (auth cleanup) + A3 (onboarding)
2. A4 (notifications panel) + A5 (actions rapides) + A6 (search card balance)
3. A7 (LocationPicker) + A8 (search page refonte)
4. A9 (publish + carte) + A10 (driver dashboard + carte)
5. A11 (chat) + A12 (trip detail carte)
6. B1-B2 (Supabase client + migrations)
7. B3 (auth)
8. B4 (hooks data)
9. B5 (push notifications)

### Section technique

- Mapbox GL JS sera utilisé via le token dans `.env` (`MAPBOX_ACCESS_TOKEN`) — exposé côté client via `VITE_MAPBOX_ACCESS_TOKEN`
- Les variables `.env` pour le client doivent être préfixées `VITE_` pour être accessibles dans Vite
- Le composant `Sheet` existant (`src/components/ui/sheet.tsx`) sera utilisé pour le panel de notifications
- Le `LocationPicker` utilisera un `Popover` existant comme base
- Les illustrations SVG seront des composants inline React (pas de fichiers externes)

