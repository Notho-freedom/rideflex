
# Plan -- Corrections critiques et fonctionnalités manquantes

## 1. Corriger le crash (ecran blanc) sur TripDetailPage

**Cause probable :** Quand un trajet n'a pas de coordonnees GPS (`from_lat`, `from_lng`, `to_lat`, `to_lng` sont `null`), le code appelle `getRoute([null, null], [null, null])` et passe des markers avec `lng: null, lat: null` a MapboxMap. Mapbox plante silencieusement et React affiche un ecran blanc.

**Correction :**
- Ajouter des gardes dans `TripDetailPage.tsx` : ne pas appeler `getRoute` ni creer de markers si les coordonnees sont nulles
- Ajouter un `try/catch` autour de `getRoute` pour ne pas planter si l'API echoue
- Masquer la carte si aucune coordonnee n'est disponible
- Ajouter un ErrorBoundary global dans `Index.tsx` pour empecher l'ecran blanc total
- Proteger `trip.price * trip.seats_total` contre les valeurs null

## 2. Page de profil public (visiter le profil des autres)

**Probleme :** Impossible de voir le profil d'un autre utilisateur. Seul le profil personnel existe.

**Solution :**
- Creer `UserPublicProfilePage.tsx` avec : avatar, nom, note, nombre de trajets, bio, badge "Verifie", bouton "Contacter"
- Ajouter la route `user-profile` dans `Index.tsx` avec `pageData.userId`
- Rendre l'avatar/nom cliquable dans `TripDetailPage`, `SearchPage`, `ChatPage` pour naviguer vers ce profil

## 3. Brancher "Dispo maintenant" dans SearchPage

**Probleme :** Le bouton "Dispo maintenant" toggle un booleen local mais ne filtre rien. Les chauffeurs ayant active le mode dispo n'apparaissent nulle part.

**Solution :**
- Quand `showAvailableOnly` est actif, requeter la table `driver_availability` (where `is_available = true`) et joindre les profils
- Afficher ces chauffeurs dans une section separee (avatar, nom, note, rayon, vehicule) au-dessus de la liste de trajets
- Permettre de cliquer sur un chauffeur dispo pour voir son profil public ou le contacter

## 4. Petites finitions UX

- **BookingConfirmation sans tripId** : afficher "Reservation introuvable" au lieu de prix 0.00 EUR
- **Bouton "Payer" en mode especes** : au lieu de rediriger vers Stripe (pas active), marquer simplement la reservation comme confirmee avec un toast
- **Date lisible** : formatter `departure_date` en format humain ("Lun 5 mai" au lieu de "2026-05-05")
- **Scroll to top** : quand on navigue vers une nouvelle page, remonter en haut

---

## Fichiers modifies

- `src/pages/TripDetailPage.tsx` -- protection coordonnees null + ErrorBoundary + lien profil
- `src/pages/UserPublicProfilePage.tsx` (nouveau) -- profil public
- `src/pages/Index.tsx` -- nouvelle route + ErrorBoundary + scroll top
- `src/pages/SearchPage.tsx` -- filtre "Dispo maintenant" branche sur driver_availability
- `src/pages/BookingConfirmation.tsx` -- fallback sans tripId + mode especes
- `src/pages/HomePage.tsx` -- lien profil chauffeur cliquable

## Ordre

1. Corriger le crash TripDetailPage (priorite absolue)
2. Ajouter ErrorBoundary global
3. Creer UserPublicProfilePage + route
4. Brancher "Dispo maintenant"
5. Finitions UX (dates, scroll, especes)
