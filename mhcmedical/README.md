# Site vitrine — Medical Health and Care (mhcmedical.fr)

Site statique (HTML/CSS/JS, sans framework ni build) correspondant à la **Phase 1** du document de cadrage : Accueil, Comment ça marche, Nos équipements, Professionnels de santé, Le magasin, Contact et pages légales.

## Lancer en local

Aucune dépendance. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
npx serve mhcmedical -p 4180
```

## Structure

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil — les 9 blocs du cadrage |
| `comment-ca-marche.html` | Les 6 questions (ordonnance, coût, entente préalable, achat/location, délais, SAV) |
| `equipements.html` | Les 5 familles, sans prix, sans produits Titre II |
| `professionnels.html` | Page prescripteurs : délivrance, zone, délais, administratif, contact direct |
| `magasin.html` | Adresse, horaires, accès, plan (chargé après consentement), équipe |
| `contact.html` | Téléphone d'abord + formulaire minimal (aucune donnée de santé) |
| `mentions-legales.html`, `confidentialite.html`, `cookies.html`, `materiovigilance.html` | Pages obligatoires |
| `assets/styles.css` | Charte : bleu profond + turquoise, corps de texte 18 px, contrastes élevés |
| `assets/site.js` | Menu mobile, bandeau cookies (accepter / refuser / paramétrer), carte Google Maps chargée uniquement après accord |

## À compléter avant mise en ligne

Rechercher `TODO` et `[à compléter]` dans les fichiers :

- [ ] **Numéro de téléphone définitif** — remplacer `04 91 00 00 00` / `tel:+33491000000` partout
- [ ] **Emails définitifs** — `contact@mhcmedical.fr` et `prescripteurs@mhcmedical.fr` à confirmer ou remplacer
- [ ] **Capital social** et **n° de TVA intracommunautaire** (`mentions-legales.html`)
- [ ] **Nom du directeur de publication** (`mentions-legales.html`)
- [ ] **Contact matériovigilance / réclamations** dédié (`materiovigilance.html`)
- [ ] **Logo** (le logo actuel est un texte + pictogramme provisoire)
- [ ] **Photos** : accroche de l'accueil (personne âgée + proche, lumière naturelle), devanture et intérieur du magasin, équipe (avec accord écrit) — les emplacements `photo-attente` sont prévus
- [ ] Vérifier la **liste des équipements** contre le stock réel
- [ ] Confirmer les **horaires** et les informations de stationnement

## Règles éditoriales respectées (à maintenir)

- Aucun prix, aucun montant de remboursement chiffré
- Aucun produit Titre II (orthèses, attelles, genouillères)
- Formulations prudentes : « selon les conditions de prise en charge en vigueur », « sous réserve de l'accord de votre caisse »
- Aucune donnée de santé demandée par le formulaire
- Corps de texte ≥ 18 px, boutons larges, navigation clavier, alternatives textuelles
