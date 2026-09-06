# Medical Health and Care — site vitrine

Site vitrine et catalogue illustré (sans prix, sans paiement en ligne) pour
**Medical Health and Care**, prestataire de matériel médical (PSDM) à Marseille.

> Positionnement : « Votre matériel médical pris en charge, sans avance de frais. »

Ce dossier contient la **Phase 1** (le socle) : accueil, comment ça marche,
équipements, professionnels de santé, magasin, contact et mentions obligatoires.

## Comment ça fonctionne

Le site est **100 % statique** (HTML/CSS/JS, aucune dépendance à l’exécution).
Un petit générateur Node assemble les pages à partir d’un gabarit commun
(en-tête, navigation, pied de page, bandeau cookies) pour éviter toute
duplication.

```
mhc-medical/
├── build.mjs            Générateur : écrit les pages dans public/
├── src/
│   ├── site.mjs         Coordonnées, navigation, mentions (à compléter)
│   ├── layout.mjs       Gabarit HTML commun
│   ├── components.mjs   Blocs réutilisables (parcours, encart pro…)
│   ├── data.mjs         Familles d’équipements (sans prix)
│   ├── icons.mjs        Icônes SVG en ligne
│   └── pages/           Contenu de chaque page
└── public/              SORTIE générée — à héberger telle quelle
    ├── *.html
    ├── assets/{css,js,img}
    ├── sitemap.xml
    └── robots.txt
```

## Développement

Prérequis : Node ≥ 18.

```bash
cd mhc-medical
npm run build      # génère public/
npm run serve      # génère puis sert public/ sur http://localhost:4174
```

Le dossier `public/` est directement hébergeable (OVH, Netlify, GitHub Pages…).

## À compléter avant la mise en production

Les valeurs marquées **« À CONFIRMER »** dans `src/site.mjs` :

- [ ] Numéro de téléphone et email professionnels définitifs
- [ ] Capital social et numéro de TVA intracommunautaire
- [ ] Nom du directeur de la publication
- [ ] Contact matériovigilance

À rassembler (voir cahier des charges §11) :

- [ ] Logo définitif (un logo provisoire est fourni : `public/assets/img/logo.svg`)
- [ ] Photos de la devanture et de l’intérieur du magasin
- [ ] Photos de l’équipe (avec accord écrit)
- [ ] Liste précise des équipements réellement en stock

Les emplacements photo sont matérialisés par des blocs de remplacement
(`.media-ph`) décrivant la photo attendue.

Enfin, brancher les formulaires (contact et prescripteurs) à une messagerie
sécurisée — **aucune donnée de santé** ne doit transiter par ces formulaires.

## Principes respectés

- **Accessibilité** : corps de texte ≥ 17 px, contrastes élevés, focus clavier
  visible, lien d’évitement, cibles tactiles larges, navigation mobile.
- **Prudence rédactionnelle** : aucun prix ni remboursement chiffré ; formules
  « selon les conditions de prise en charge en vigueur » / « sous réserve de
  l’accord de votre caisse ».
- **Périmètre** : pas de produits Titre II (orthèses, attelles, genouillères).
- **RGPD** : bandeau cookies avec choix réel (accepter / refuser / paramétrer),
  aucun cookie de mesure sans consentement.
```
