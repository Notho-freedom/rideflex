
# Plan -- Continuation RideFlex

## 1. Connexion Google fonctionnelle

L'AuthPage utilise `lovable.auth.signInWithOAuth('google')`. Verifier que le provider Google est bien configure cote backend (via `configure_auth`). Si ce n'est pas le cas, l'activer.

**Fichier:** aucun changement de code si deja fonctionnel, sinon correction dans `AuthPage.tsx`.

---

## 2. Profil progressif (ProfileCompletionModal)

Le modal existe mais n'est jamais declenche. L'integrer dans les flux critiques :
- **PublishPage** : avant de publier un trajet, verifier que le profil a un nom et telephone. Si non, ouvrir le modal.
- **Booking (TripDetailPage)** : avant de reserver, verifier que le passager a un nom. Si non, ouvrir le modal.
- **ChatPage** : avant d'envoyer le premier message, verifier le nom.

Le modal doit sauvegarder les donnees dans la table `profiles` via `useProfile.updateProfile`.

**Fichiers:** `PublishPage.tsx`, `TripDetailPage.tsx`, `ChatPage.tsx`

---

## 3. Recherche fonctionnelle dans HomePage

Le formulaire de recherche (depart/arrivee/date) sur la HomePage ne transmet pas les criteres a SearchPage. Faire passer `departure`, `arrival`, `date` via `pageData` et pre-remplir les champs de SearchPage.

**Fichiers:** `HomePage.tsx`, `SearchPage.tsx`, `Index.tsx`

---

## 4. Filtres de recherche avances

SearchPage a des toggles bagages/animaux mais il manque :
- Filtre par **date** (champ date picker)
- Filtre par **prix max**
- Filtre par **nombre de places** disponibles
- **Tri** (prix croissant, date, note du chauffeur)

**Fichier:** `SearchPage.tsx`

---

## 5. Annulation de trajet par le chauffeur

MyTripsPage en mode chauffeur affiche les trajets mais ne permet pas de les annuler ou modifier. Ajouter :
- Bouton "Annuler" pour passer le statut a `cancelled`
- Bouton "Modifier" pour revenir a un formulaire pre-rempli (ou inline)

**Fichier:** `MyTripsPage.tsx`

---

## 6. Notation apres trajet

RatingPage existe mais n'est jamais proposee. Apres qu'un trajet passe en statut `completed`, afficher un prompt/banner dans MyTripsPage pour noter l'autre partie.

**Fichier:** `MyTripsPage.tsx`

---

## 7. Polish UX general

- **Etat vide ameliore** : illustrations SVG pour les listes vides (pas juste du texte)
- **Confirmation de reservation** : toast + animation de succes au lieu d'une simple redirection
- **Nombre de passagers** : permettre de choisir le nombre de places lors de la reservation (TripDetailPage a deja un champ mais la valeur n'est pas toujours passee)
- **Indicateur "en ligne"** : point vert sur l'avatar des chauffeurs dispo dans SearchPage
- **Swipe-to-action** sur mobile pour les reservations (accept/refuse)

**Fichiers:** Multiples pages

---

## Ordre d'execution

1. Google Auth verification + activation
2. Recherche HomePage -> SearchPage (passage de criteres)
3. Filtres avances SearchPage
4. Profil progressif (modal dans les flux critiques)
5. Annulation/modification trajets chauffeur
6. Notation post-trajet
7. Polish UX (etats vides, confirmations, indicateurs)

---

## Detail technique

### Migration DB
Aucune migration necessaire -- toutes les tables et colonnes existent deja.

### Fichiers modifies
- `src/pages/HomePage.tsx` -- passage des criteres de recherche
- `src/pages/SearchPage.tsx` -- reception criteres, filtres avances, tri, indicateur en ligne
- `src/pages/Index.tsx` -- passage de pageData pour la recherche
- `src/pages/PublishPage.tsx` -- declenchement ProfileCompletionModal
- `src/pages/TripDetailPage.tsx` -- declenchement ProfileCompletionModal avant booking
- `src/pages/MyTripsPage.tsx` -- annulation trajet, prompt notation
- `src/pages/ChatPage.tsx` -- declenchement ProfileCompletionModal
- `src/components/rideflex/ProfileCompletionModal.tsx` -- connexion a useProfile pour sauvegarder
