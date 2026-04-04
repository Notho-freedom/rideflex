

# Plan — Nouvelles fonctionnalites RideFlex (document de conception)

Ce document de conception detaille les evolutions majeures issues de votre cahier des charges. L'objectif est d'enrichir RideFlex avec les fonctionnalites manquantes : demandes de trajet par les passagers, calcul automatique d'arrivee, trajets reguliers, option prive, combinaisons intelligentes, gestion bagages/animaux, et monetisation par commission.

---

## Nouvelles fonctionnalites a implementer

### 1. Demandes de trajet (passager publie une demande)

Nouveau concept : en plus des trajets publies par les chauffeurs, un passager peut publier une **demande de trajet** ("Je cherche un trajet Montreal -> Ottawa le 15 avril").

**Fichiers concernes :**
- Nouveau `src/pages/PublishRequestPage.tsx` — formulaire similaire a PublishPage mais pour passagers (depart, arrivee, date, heure souhaitee, prix propose, nombre de places)
- Nouveau `src/pages/TripRequestsPage.tsx` — liste des demandes de passagers visibles par les chauffeurs
- Mise a jour `database.ts` — nouvelle table `trip_requests` (publisher_id, from_city, to_city, desired_date, desired_time, proposed_price, seats_needed, accepts_luggage, accepts_animals, status)
- Mise a jour `HomePage.tsx` — nouvelle action rapide "Publier une demande"
- Mise a jour `SearchPage.tsx` — onglet/filtre pour voir les demandes de passagers (cote chauffeur)

### 2. Calcul automatique de l'heure d'arrivee

Utiliser l'API Mapbox Directions pour calculer la duree du trajet quand le chauffeur publie.

**Fichiers concernes :**
- `PublishPage.tsx` — apres saisie depart + arrivee + heure depart, appeler Mapbox Directions API et afficher l'heure d'arrivee estimee automatiquement
- Nouveau `src/lib/mapbox.ts` — fonctions utilitaires : `getRoute(from, to, stops[])` retourne duree + distance + geometrie
- `TripDetailPage.tsx` — afficher l'heure d'arrivee estimee

### 3. Option aller-retour

**Fichiers concernes :**
- `PublishPage.tsx` — ajouter un toggle "Aller-retour" ; si active, afficher les champs retour (date retour, heure retour) ; a la publication, creer 2 trajets (aller + retour inverse)
- `database.ts` — ajouter champ optionnel `return_trip_id` sur `trips` pour lier aller et retour

### 4. Trajets reguliers / recurrents

Permettre a un chauffeur de marquer un trajet comme "regulier" (tous les jours, tous les lundis, etc.).

**Fichiers concernes :**
- `PublishPage.tsx` — section "Recurrence" avec options (quotidien, hebdomadaire + jours, mensuel)
- `database.ts` — ajouter `is_recurring`, `recurrence_pattern` (jsonb) sur `trips`
- Nouveau hook `useRecurringTrips.ts` — logique de generation des occurrences

### 5. Option trajet prive (passager reserve toute la voiture)

**Fichiers concernes :**
- `TripDetailPage.tsx` / `BookingConfirmation.tsx` — option "Reserver en prive" (reserver toutes les places)
- `BookingRequestsPage.tsx` — badge "Prive" sur la reservation
- Prix calcule = prix_par_place x nombre_total_places

### 6. Gestion bagages et animaux

**Fichiers concernes :**
- `PublishPage.tsx` — toggles "Bagages acceptes" et "Animaux acceptes"
- `database.ts` — ajouter `accepts_luggage`, `accepts_animals` (boolean) sur `trips`
- `SearchPage.tsx` — filtres bagages/animaux
- `TripDetailPage.tsx` — afficher les icones bagages/animaux

### 7. Combinaisons intelligentes de trajets

Algorithme qui propose au chauffeur de combiner des trajets compatibles (ex. Montreal -> Cornwall + Cornwall -> Ottawa).

**Fichiers concernes :**
- Nouveau `src/lib/tripCombinator.ts` — algorithme :
  1. Trouver les trajets dont le depart est proche de la destination du trajet courant
  2. Filtrer par direction (meme sens general), horaire compatible (arrivee trajet 1 < depart trajet 2)
  3. Limiter les detours a 20 min max (via Mapbox Directions)
- `DriverDashboard.tsx` ou nouveau `src/pages/TripCombinationsPage.tsx` — afficher les combinaisons suggerees
- `TripDetailPage.tsx` — section "Trajets combinables" pour le chauffeur

### 8. Profil enrichi — creation progressive

Au lieu de demander toutes les infos au signup, demander le profil complet uniquement au premier usage significatif (publier un trajet, contacter un chauffeur).

**Fichiers concernes :**
- Nouveau `src/components/rideflex/ProfileCompletionModal.tsx` — modal qui demande les infos manquantes (nom, photo, telephone, vehicule si chauffeur)
- `PublishPage.tsx`, `ChatPage.tsx` — verifier si profil complet avant d'agir, sinon afficher le modal

### 9. Commission sur paiements (monetisation)

**Fichiers concernes :**
- Mise a jour `database.ts` — ajouter `platform_fee`, `driver_payout` sur `bookings`
- Logique Stripe : lors du paiement, appliquer une commission (ex. 10%) et transferer le reste au chauffeur via Stripe Connect
- Nouveau Edge Function pour le paiement avec commission

### 10. Logo et branding

Copier l'icone de covoiturage fournie dans le projet et l'utiliser comme logo.

**Fichiers concernes :**
- Copier `icone-covoiturage-voiture-passagers_116137-1451-removebg-preview.png` dans `src/assets/logo.png`
- Copier le `.ico` dans `public/favicon.ico`
- Mettre a jour `SideNav.tsx`, `OnboardingPage.tsx`, `AuthPage.tsx`, `index.html`

---

## Migrations SQL a ajouter

```text
-- Nouvelles colonnes sur trips
ALTER TABLE trips ADD COLUMN accepts_luggage boolean DEFAULT true;
ALTER TABLE trips ADD COLUMN accepts_animals boolean DEFAULT false;
ALTER TABLE trips ADD COLUMN is_recurring boolean DEFAULT false;
ALTER TABLE trips ADD COLUMN recurrence_pattern jsonb;
ALTER TABLE trips ADD COLUMN return_trip_id uuid REFERENCES trips(id);
ALTER TABLE trips ADD COLUMN estimated_arrival_time text;
ALTER TABLE trips ADD COLUMN from_lat double precision;
ALTER TABLE trips ADD COLUMN from_lng double precision;
ALTER TABLE trips ADD COLUMN to_lat double precision;
ALTER TABLE trips ADD COLUMN to_lng double precision;

-- Nouvelle table trip_requests
CREATE TABLE trip_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_city text NOT NULL,
  to_city text NOT NULL,
  desired_date date NOT NULL,
  desired_time text,
  proposed_price numeric,
  seats_needed integer DEFAULT 1,
  accepts_luggage boolean DEFAULT true,
  accepts_animals boolean DEFAULT false,
  is_private boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Commission fields on bookings
ALTER TABLE bookings ADD COLUMN total_price numeric;
ALTER TABLE bookings ADD COLUMN platform_fee numeric;
ALTER TABLE bookings ADD COLUMN driver_payout numeric;

-- Profiles: WhatsApp + preferences
ALTER TABLE profiles ADD COLUMN whatsapp_number text;
ALTER TABLE profiles ADD COLUMN show_whatsapp boolean DEFAULT false;
```

---

## Ordre d'implementation

1. **Logo & branding** — copier images, mettre a jour favicon et composants
2. **Schema enrichi** — mettre a jour `database.ts` avec tous les nouveaux champs
3. **PublishPage** — aller-retour, recurrence, bagages/animaux, calcul auto arrivee
4. **PublishRequestPage** — nouvelle page pour les demandes passagers
5. **SearchPage** — filtres bagages/animaux/prive, onglet demandes passagers
6. **TripDetailPage** — option prive, affichage bagages/animaux, heure arrivee
7. **ProfileCompletionModal** — creation progressive du profil
8. **TripCombinator** — algorithme de combinaison + UI
9. **Monetisation** — commission Stripe sur bookings
10. **Migrations SQL** — a executer sur le projet Supabase

