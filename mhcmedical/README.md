# MHC Medical Health and Care — Site complet

Site vitrine pour **mhcmedical.fr** — matériel médical à Marseille, tiers payant intégral.

## Structure (22 pages)

```
index.html                    Accueil
vous-etes-patient.html        Hub patient
vous-etes-aidant.html         Hub aidant
comment-ca-marche.html        Parcours en 4 étapes
prise-en-charge.html          Ce qui est pris en charge
nos-equipements.html          Catalogue (5 catégories)
equipements/                  Pages détaillées par catégorie
aidant/                       3 guides aidants
professionnels-sante.html     Espace prescripteurs
le-magasin.html               Adresse, horaires, carte
equipe.html                   L'équipe
contact.html                  Téléphone + formulaire
mentions-legales.html         Obligatoire
politique-confidentialite.html
cookies.html
reclamations.html
404.html
sitemap.xml / robots.txt
```

## Prévisualisation

```bash
cd mhcmedical
npx serve . -p 4173
```

## Régénérer les pages

```bash
node scripts/build-pages.mjs
```

## Déploiement OVH

Uploader le dossier `mhcmedical/` à la racine de `mhcmedical.fr`.

## Coordonnées

- **07 77 77 89 47** · **contact@mhcmedical.fr**
- 185 avenue de Saint Louis, 13015 Marseille

## À compléter

- Capital social, TVA, directeur de publication
- Contact matériovigilance
- Photos devanture et équipe
- Backend formulaire (actuellement mailto)
