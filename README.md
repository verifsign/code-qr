# CRM Stagiaires — DATA FORMA · QR Vérification

Système de gestion des attestations de signature électronique et de génération de QR codes pour les stagiaires DATA FORMA.

## Structure

```
index.html        → CRM (gestion stagiaires + génération QR)
verify/index.html → Page de vérification (cible des QR codes)
```

## Mise en ligne (GitHub Pages)

1. Aller dans **Settings → Pages** du dépôt GitHub
2. Source : **Deploy from a branch** → branche `main` → dossier `/` (root)
3. Sauvegarder — GitHub Pages sera accessible à :
   - **CRM** : `https://verifsign.github.io/code-qr/`
   - **Vérification** : `https://verifsign.github.io/code-qr/verify/`

Le CRM détecte automatiquement l'URL de base correcte.

## Utilisation

1. Ouvrir `index.html` (ou l'URL GitHub Pages)
2. Ajouter un stagiaire avec ses informations et ses signataires
3. Cliquer sur **QR** dans la liste
4. Télécharger le QR code et l'insérer dans le PDF d'attestation
5. Tout scanner du QR affiche les infos du document sur `verify/`

## Fonctionnalités

- Gestion complète des stagiaires (ajout / modification / suppression)
- Génération QR code embarquant toutes les données du document
- Page de vérification responsive (mobile + ordinateur)
- Export / Import JSON pour sauvegarder les données
- Recherche en temps réel dans la liste

## Données

Les données sont stockées dans le `localStorage` du navigateur.  
Utilisez **Exporter JSON** / **Importer JSON** (section À propos) pour les sauvegarder ou les transférer.
