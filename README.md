# Vérification document par QR code

Page web responsive (mobile + ordinateur) pour afficher les informations de signature enregistrées dans votre CRM de contrôle. Généralisée pour **tous les stagiaires** : chaque document a un identifiant unique, le QR code pointe vers la page de vérification.

## Fonctionnement

```
CRM (signature réelle) → export JSON → data/envelopes/{id}.json → QR code → scan → page de vérification
```

Deux modes supportés :

| Mode | URL QR | Usage |
|------|--------|-------|
| **id** (recommandé) | `https://…/code-qr/?id=A7B7434617A74` | Court, scalable, une fiche JSON par stagiaire |
| **hash** | `https://…/code-qr/#d=<données encodées>` | Autonome, sans fichier serveur (URL plus longue) |

## Démo locale

```bash
npm install
npm run serve
# Ouvrir http://localhost:4173/?id=A7B7434617A74
```

## Générer un QR code

```bash
# Depuis une fiche existante
npm run qr -- --id A7B7434617A74

# Depuis un export CRM
npm run qr -- --file docs/exemple-export-crm.json

# Mode hash (données embarquées dans l'URL)
npm run qr -- --file data/envelopes/A7B7434617A74.json --mode hash
```

Le PNG est créé dans `output/qr-{id}.png`. Intégrez cette image dans votre PDF d'attestation.

## Brancher le CRM Facturation V2 (Flask)

Le module d'intégration est dans `integration/crm/`. Guide complet : [`integration/crm/INTEGRATION.md`](integration/crm/INTEGRATION.md).

Ce module inclut aussi l'**automatisation du remplissage des CERFA** (ex.
contrat d'apprentissage, transmission à un OPCO tel qu'Opcommerce) : voir
[`integration/crm/CERFA.md`](integration/crm/CERFA.md).

Résumé en 4 lignes dans `app.py` :

```python
from integration.crm import register_signature_module
signature_service = register_signature_module(
    app, get_db, OUTPUT_FOLDER,
    verif_base_url='https://verifsign.github.io/code-qr/',
    format_date_fr=format_date_fr,
    code_qr_data_dir=os.path.join(BASE_DIR, '..', 'code-qr', 'data', 'envelopes'))
```

Workflow par stagiaire :
1. `POST /api/signature/enveloppe` avec `dossier_id` → crée l'enveloppe
2. `POST .../signer` à chaque signature (horodatage réel automatique)
3. `POST .../sceller` avec le chemin du PDF → SHA-256 + export JSON + QR
4. Insérer le PNG `output/qr-{id}.png` dans l'attestation

La page statique accepte aussi l'API CRM : `?id=XXX&api=http://localhost:5050`

---

## Brancher le CRM (export JSON manuel)

### 1. Champs à utiliser (données RÉELLES)

Ne pas utiliser de valeurs calculées à partir du nom (`et(...)`, `ce(...)`). Utiliser les champs enregistrés au moment de la signature :

| Champ CRM | Champ JSON | Obligatoire |
|-----------|------------|-------------|
| `envelopeId` | `id` | oui |
| `organismeNom` | `organisme` | oui |
| `intituleDocument` | `intituleDocument` | non |
| `statut` | `statut` | non |
| `stagiaire.nom` | `beneficiaire` | non |
| `createdAt` | `creeLe` | non |
| `pdfSha256` | `hashPdf` | non |
| `signataires[].nom` | `signataires[].nom` | oui |
| `signataires[].role` | `signataires[].role` | non |
| `signataires[].signedAt` | `signataires[].signeLe` | **oui — horodatage réel** |
| `signataires[].email` | `signataires[].email` | non |
| `signataires[].ip` | `signataires[].ip` | non |

Voir `docs/schema-envelope.json` pour le schéma complet.

### 2. Exporter depuis le CRM

À chaque signature terminée, exporter un JSON (webhook, script, ou export manuel) au format `docs/exemple-export-crm.json`.

### 3. Synchroniser les fiches

```bash
npm run sync -- path/vers/export-stagiaire.json
# ou un dossier entier
npm run sync -- path/vers/exports/
```

### 4. Générer l'URL / QR pour le PDF

En JavaScript (navigateur ou Node) :

```javascript
import { VERIF_BASE_URL } from './config.js';
import Verification from './lib/verification.js';

const crmRecord = { /* vos champs CRM */ };
const data = Verification.buildEnvelopePayload(crmRecord);
const url = Verification.buildVerificationUrl(VERIF_BASE_URL, data, 'id');
// url → à encoder dans le QR du PDF
```

### 5. Configurer l'URL de production

Modifier `config.js` :

```javascript
export const VERIF_BASE_URL = 'https://votre-domaine.fr/verification/';
```

Puis héberger `index.html`, `lib/` et `data/envelopes/` (GitHub Pages, Netlify, ou votre serveur).

## Déploiement GitHub Pages

1. Pousser sur `main`
2. Paramètres du dépôt → Pages → source : branche `main`, dossier `/ (root)`
3. URL finale : `https://verifsign.github.io/code-qr/`

Après chaque nouveau stagiaire : ajouter `data/envelopes/{id}.json`, commit, push.

## Exemple inclus

Le stagiaire **BAPTISTE BLETEAU** (identifiant `A7B7434617A74`) est déjà configuré à partir de l'attestation fournie.

Test : [/?id=A7B7434617A74](https://verifsign.github.io/code-qr/?id=A7B7434617A74) (après déploiement).

## Intégrité SHA-256

Le QR est imprimé **dans** le PDF : il ne peut pas contenir l'empreinte de ce même PDF (référence circulaire). Options :

- Hacher le contenu signé **avant** insertion du QR, ou
- Stocker le PDF côté serveur et faire vérifier l'empreinte via une API (évolution future).

La page affiche l'empreinte telle qu'enregistrée dans le CRM ; la comparaison manuelle reste possible.

## Structure

```
index.html              Page de vérification (mobile + desktop)
lib/verification.js     Encodage URL + mapping CRM
config.js               URL de base de production
data/envelopes/         Une fiche JSON par document / stagiaire
scripts/generate-qr.mjs Génération PNG
scripts/sync-envelope.mjs Import depuis le CRM
docs/                   Schéma et exemple d'export
```
