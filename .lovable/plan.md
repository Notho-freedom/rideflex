

# Plan — Rééquilibrage des interfaces + Mode Passager/Chauffeur + Carte Mapbox 3D

## Résumé

3 axes de travail :
1. **Rééquilibrage des layouts** sur les pages déséquilibrées (TripDetail, Publish, etc.)
2. **Système de rôle Passager/Chauffeur** avec switch et adaptation des vues
3. **Carte Mapbox 3D** sur la page de recherche avec filtres par rayon et marqueurs

---

## 1. Rééquilibrage des layouts

### TripDetailPage
- Déplacer les cartes "Bagages/Animaux" et "Prix + réservation privée" de la colonne gauche vers la colonne droite (sous le profil chauffeur)
- Étaler la carte Mapbox du trajet sur les 2 colonnes (`lg:col-span-2`) en dessous

### PublishPage
- Déplacer la carte interactive en dessous du formulaire, pleine largeur (`lg:col-span-2`), avant le bouton Publier
- Séparer le formulaire en 2 colonnes sur desktop : colonne 1 = Itinéraire + Date/Heure, colonne 2 = Détails + Sièges

### Autres pages
- Vérifier et appliquer le même principe d'équilibre sur DriverDashboard (déjà en 2 colonnes, OK)

---

## 2. Système Passager / Chauffeur

### Concept
- Par défaut, tout le monde est passager après inscription
- Un switch permet de basculer en mode chauffeur à tout moment
- Le mode sélectionné est stocké en state global (React context) et persisté en `localStorage`
- L'interface s'adapte selon le mode actif

### Fichiers concernés

**Nouveau : `src/contexts/UserModeContext.tsx`**
- Context React avec `mode: 'passenger' | 'driver'` et `toggleMode()`
- Persistance localStorage

**AuthPage** — Après inscription, ajouter un écran de sélection du mode initial (passager par défaut, option chauffeur)

**HomePage — Actions rapides adaptatives**
- Mode **passager** (bleu) : "Publier une demande", "Mes trajets", "Chauffeurs dispo"
- Mode **chauffeur** (vert/teal) : "Publier un trajet", "Mode Dispo", "Mes réservations"
- Code couleur : bleu = passager, vert/teal = chauffeur

**SideNav + BottomNav** — Ajouter indicateur de mode actif dans la sidebar (pastille colorée ou badge)

**ProfilePage** — Ajouter un switch Passager/Chauffeur visible (ou dans la popover avatar du header)

**SearchPage** — En mode passager : cherche des chauffeurs. En mode chauffeur : peut aussi voir les demandes passagers.

---

## 3. Carte Mapbox 3D sur la page de recherche

### Architecture

**Nouveau view mode sur SearchPage** : `list` | `map`
- Ajouter un filtre-pill "Carte" dans les filtres rapides existants
- Quand activé, remplace la liste par une carte Mapbox GL JS pleine largeur

**Carte Mapbox GL JS** :
- Style 3D avec bâtiments : `mapbox://styles/mapbox/streets-v12` + `pitch: 60`, `bearing: -17.6`
- Utiliser `map.addLayer({ type: 'fill-extrusion', source: 'composite', 'source-layer': 'building' })` pour les bâtiments 3D
- Géolocalisation utilisateur via `navigator.geolocation` → centrer la carte

**Filtres rayon** :
- Quand mode carte activé, afficher un slider ou des pills prédéfinis (5km, 10km, 15km, 25km, 50km)
- Dessiner un cercle (`turf.circle` ou polygone GeoJSON) autour de la position utilisateur
- Filtrer dynamiquement les résultats dans le rayon

**Marqueurs** :
- Chaque chauffeur = marqueur personnalisé sur la carte (icône + prix)
- Au clic sur un marqueur → popup card avec infos du chauffeur (nom, rating, prix, destination)
- Au clic sur la card → naviguer vers `trip-detail`

### Installation
- `npm install mapbox-gl @types/mapbox-gl` (Mapbox GL JS)
- Token déjà disponible : `VITE_MAPBOX_ACCESS_TOKEN`

### Composant
**Nouveau : `src/components/rideflex/MapboxSearch.tsx`**
- Composant React encapsulant le canvas Mapbox
- Props : `trips[]`, `userPosition`, `radius`, `onTripClick`
- Gère le cercle de rayon et les marqueurs

---

## 4. Cartes Mapbox réelles sur les autres pages

### TripDetailPage
- Remplacer le placeholder par une vraie carte Mapbox traçant l'itinéraire (LineString GeoJSON de `getRoute()`)
- Marqueurs aux arrêts intermédiaires

### PublishPage
- Carte interactive affichant le tracé au fur et à mesure que l'utilisateur saisit départ/arrêts/arrivée
- Utiliser `geocode()` + `getRoute()` de `src/lib/mapbox.ts`

### DriverDashboard
- Remplacer le placeholder par une vraie carte Mapbox avec position GPS et cercle de rayon

---

## Ordre d'exécution

1. Installer `mapbox-gl` + créer `MapboxSearch.tsx`
2. Rééquilibrer TripDetailPage et PublishPage
3. Créer `UserModeContext` + intégrer le switch dans ProfilePage/SideNav
4. Adapter HomePage (actions rapides par mode + code couleur)
5. Refondre SearchPage avec mode carte + marqueurs + rayon
6. Intégrer cartes Mapbox réelles sur TripDetail, Publish, DriverDashboard

