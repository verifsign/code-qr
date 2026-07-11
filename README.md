# code-qr

Service de vérification par QR code pour tes documents/attestations
signés (dossiers d'audit, attestations de stage, etc.), **généralisé à tous
les stagiaires** et branchable sur ton CRM.

## Le principe (pourquoi ce n'est pas juste une page qui lit le QR)

La proposition de départ encodait toutes les données (signataires, dates,
empreinte...) directement dans l'URL du QR code, en base64. Ça fonctionne
pour un document isolé mais pose plusieurs problèmes dès que tu veux
généraliser à tous les stagiaires et brancher un CRM :

- **Pas de source de vérité unique** : les données sont figées dans le QR au
  moment de l'impression. Si tu corriges une info après coup, il faut
  réimprimer le document.
- **Référence circulaire sur l'empreinte** : un QR imprimé *dans* le PDF ne
  peut pas contenir l'empreinte SHA-256 de ce même PDF, puisque l'empreinte
  n'existe qu'une fois le PDF finalisé.
- **Pas de contrôle a posteriori** : impossible de révoquer, corriger ou
  compléter une fiche sans changer le QR.

Ce projet inverse la logique : **le QR ne contient qu'un lien court avec un
identifiant** (`https://ton-domaine/v/<identifiant>`). Quand quelqu'un scanne
(au téléphone) ou clique (sur ordinateur), la page appelle ce serveur et
affiche les données **actuelles** stockées côté serveur pour cet identifiant.
Ton CRM devient la source de vérité : il crée/met à jour l'enregistrement via
l'API, et le lien QR reste stable.

Cela résout aussi le problème de référence circulaire : l'empreinte du PDF
final (`sha`) est enregistrée *après* génération du document, via un appel API
séparé — jamais encodée dans le QR lui-même.

## Démarrage

```bash
npm install
cp .env.example .env
# édite .env : renseigne API_KEY (obligatoire) et BASE_URL une fois déployé
npm start
```

Le serveur écoute par défaut sur `http://localhost:3000` :

- `/` — page d'accueil
- `/admin` — interface d'administration (créer/modifier/supprimer des
  documents et récupérer leur QR, sans écrire de code)
- `/v/<id>` — page publique de vérification (celle pointée par le QR)

En développement, `npm run dev` relance automatiquement le serveur à chaque
modification de fichier.

### Tests

```bash
npm test
```

## Modèle de données d'un document

Chaque document/attestation est identifié par un `id` (par exemple
l'identifiant d'enveloppe déjà généré par ton outil de signature actuel, ex.
`A7B7434617A74`, ou un identifiant généré automatiquement si tu ne lui en
fournis pas).

| Champ          | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `id`           | Identifiant unique (optionnel à la création, sinon généré)               |
| `org`          | Nom de ton organisme                                                     |
| `doc`          | Intitulé du document                                                     |
| `beneficiaire` | Nom du stagiaire / bénéficiaire                                          |
| `statut`       | Ex. `En cours`, `Terminé`, `Scellé`, `Annulé`                            |
| `signers`      | Tableau de signataires `{ n: nom, r: rôle, d: date/heure réelle de signature }` |
| `sha`          | Empreinte SHA-256 du PDF final (à renseigner **après** génération)       |
| `createdAt`    | Date de création (ISO 8601, générée automatiquement si absente)          |
| `sealedAt`     | Date de scellement de l'enveloppe (optionnel)                           |

La page publique calcule aussi une `dataHash` (empreinte SHA-256 des champs
ci-dessus, calculée côté serveur) pour détecter une modification des
métadonnées après coup — elle est clairement distinguée de `sha` (l'empreinte
du fichier PDF réel) pour ne jamais laisser croire à une preuve qu'on n'a pas.

**Important, comme le soulignait la proposition de départ** : les dates dans
`signers[].d` doivent être les horodatages **réellement enregistrés** au
moment de la signature (pas une date recalculée après coup), et `sha` ne doit
être renseigné que si tu disposes d'une vraie empreinte du fichier PDF final.
Si tu n'as pas encore cette empreinte, laisse simplement `sha` vide — la page
n'affichera pas cette section plutôt que d'afficher une fausse valeur.

## Brancher ton CRM

Toute la création/modification passe par l'API, protégée par une clé secrète
(`API_KEY` dans `.env`) à transmettre dans l'en-tête `x-api-key`.

### 1. Quand un stagiaire termine de signer un document

Depuis ton CRM (ou ton outil de signature), appelle :

```bash
curl -X POST https://ton-domaine/api/documents \
  -H "Content-Type: application/json" \
  -H "x-api-key: TA_CLE_API" \
  -d '{
    "id": "A7B7434617A74",
    "org": "DATA FORMA",
    "doc": "Dossier d'\''audit — NEGOCIATION ET DIGITALISATION DE LA RELATION CLIENT (BTS)",
    "beneficiaire": "BAPTISTE BLETEAU",
    "statut": "Terminé",
    "signers": [
      { "n": "SITBON RICHARD", "r": "Gérant — DATA FORMA", "d": "11/05/2026 à 15:02" },
      { "n": "BAPTISTE BLETEAU", "r": "Stagiaire", "d": "11/05/2026 à 16:30" }
    ]
  }'
```

La réponse contient `verificationUrl` (le lien à mettre dans le QR) et le
document créé.

Exemple équivalent en JavaScript (Node.js ou navigateur côté serveur) :

```js
async function enregistrerDocumentSigne(dossier) {
  const res = await fetch("https://ton-domaine/api/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.QR_API_KEY,
    },
    body: JSON.stringify({
      id: dossier.identifiantEnveloppe,
      org: "DATA FORMA",
      doc: dossier.intitule,
      beneficiaire: dossier.nomStagiaire,
      statut: dossier.statut,
      signers: dossier.signataires.map((s) => ({
        n: s.nom,
        r: s.role,
        d: s.dateHeureSignatureReelle, // horodatage réellement enregistré
      })),
    }),
  });
  const { verificationUrl } = await res.json();
  return verificationUrl; // à encoder dans le QR code
}
```

### 2. Générer le QR code à imprimer sur le PDF

Deux options :

**Option A — laisser ce serveur générer l'image** (le plus simple) :

```
GET https://ton-domaine/api/documents/A7B7434617A74/qr.png?size=1024
GET https://ton-domaine/api/documents/A7B7434617A74/qr.svg
```

Ces routes sont publiques (pas besoin de clé API) et renvoient directement
l'image du QR encodant l'URL de vérification — tu peux l'insérer telle quelle
dans ton PDF.

**Option B — générer le QR toi-même**, avec ta propre librairie, à partir de
l'URL renvoyée par l'API :

```js
const url = `https://ton-domaine/v/${documentId}`;
const qr = tonGenerateurQR(url); // ta lib QR habituelle
```

Dans les deux cas, le QR n'encode **que** ce lien — jamais les données
elles-mêmes, ni une empreinte.

### 3. Ajouter l'empreinte SHA-256 du PDF une fois généré

Une fois le PDF final produit (donc après avoir imprimé le QR dedans), calcule
son empreinte réelle et enregistre-la :

```bash
sha256sum dossier-signe.pdf
# -> aa2cdef5a92cdd62a82cdbcfa72cda3ca62cd8a9a52cd716a42cd583a32cd3f0

curl -X PUT https://ton-domaine/api/documents/A7B7434617A74 \
  -H "Content-Type: application/json" \
  -H "x-api-key: TA_CLE_API" \
  -d '{"sha": "aa2cdef5a92cdd62a82cdbcfa72cda3ca62cd8a9a52cd716a42cd583a32cd3f0"}'
```

La page de vérification affichera alors cette empreinte, clairement labellisée
comme celle du PDF, sans jamais l'avoir eu besoin dans le QR.

### Sans intégration CRM tout de suite

Tu peux commencer par utiliser `/admin` pour créer et modifier les documents
à la main (formulaire, génération et téléchargement du QR), le temps de
brancher l'automatisation avec ton CRM.

## API — référence rapide

| Méthode | Route                          | Auth      | Description                              |
| ------- | ------------------------------ | --------- | ----------------------------------------- |
| GET     | `/api/health`                  | —         | Vérifie que le serveur répond             |
| GET     | `/api/documents`               | clé API   | Liste tous les documents                  |
| POST    | `/api/documents`               | clé API   | Crée un document                          |
| GET     | `/api/documents/:id`           | —         | Lit un document (utilisé par la page)     |
| PUT     | `/api/documents/:id`           | clé API   | Met à jour un document                    |
| DELETE  | `/api/documents/:id`           | clé API   | Supprime un document                       |
| GET     | `/api/documents/:id/qr.png`    | —         | QR code au format PNG (`?size=` en px)     |
| GET     | `/api/documents/:id/qr.svg`    | —         | QR code au format SVG                      |
| GET     | `/v/:id`                       | —         | Page HTML de vérification (celle du QR)    |

## Vie privée / RGPD

La page publique n'affiche jamais l'adresse IP ni l'email des signataires,
même si tu les transmets à l'API (champs `email`/`ip` optionnels sur chaque
signataire) — ils restent en base pour ton usage interne (audit) mais ne sont
jamais renvoyés par l'API publique ni affichés sur `/v/:id`.

## Sécurité

- Change impérativement la valeur de `API_KEY` dans `.env` avant tout usage
  réel (le serveur refuse de créer des documents tant que la valeur
  d'exemple est encore utilisée).
- Sers ce service uniquement en HTTPS en production (obligatoire pour un
  usage réel, et pour que la clé API ne circule jamais en clair).
- Restreins l'accès à `/admin` si besoin (reverse proxy avec authentification
  basique, VPN, etc.) : la page elle-même est publique, mais aucune action
  d'écriture n'est possible sans la clé API.

## Limites (honnêteté avant tout)

- Cette page **ne constitue pas** une signature électronique qualifiée au
  sens du règlement eIDAS (UE n°910/2014). Elle affiche des informations
  déclaratives enregistrées par ton organisme.
- La `dataHash` protège l'intégrité des métadonnées enregistrées ici, pas le
  contenu du PDF. Seule une empreinte `sha` réellement calculée sur le PDF
  final, comparée manuellement par la personne qui vérifie, permet de
  vérifier l'intégrité du fichier.
- Le stockage utilise un fichier JSON local (`data/documents.json`), suffisant
  pour un volume de quelques milliers de documents. Pour un usage à plus
  grande échelle ou multi-instance, remplace `src/db.js` par une vraie base de
  données (PostgreSQL, etc.) — l'API et le reste du code n'ont pas besoin de
  changer.

## Déploiement

Ce service est une simple application Node.js/Express sans dépendance native :
elle se déploie sur n'importe quel hébergeur (Render, Railway, Fly.io, VPS,
etc.).

1. Déploie le code, en définissant les variables d'environnement `PORT`,
   `BASE_URL` (l'URL publique finale) et `API_KEY`.
2. Pointe ton nom de domaine (ex. `verif.dataforma.fr`) vers le service, en
   HTTPS.
3. Utilise cette URL comme `BASE_URL` : c'est elle qui sera intégrée dans les
   QR codes générés.
4. Monte un volume persistant pour le dossier `data/` (sinon les documents
   créés seront perdus au redéploiement).
