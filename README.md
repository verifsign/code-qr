# code-qr — Vérification de documents par QR code (stagiaires)

Deux pages web statiques pour **DATA FORMA** (ou tout organisme de formation) :

- **`index.html`** — la page qui s'affiche quand on **scanne** le QR code (fonctionne sur téléphone **et** ordinateur, sans installation).
- **`generateur.html`** — l'outil pour **générer les QR codes**, pour un stagiaire ou pour **toute une liste** exportée de votre CRM.

Aucun serveur applicatif, aucune base de données : ce sont de simples fichiers HTML que l'on héberge (GitHub Pages, votre site, un intranet…).

---

## 1. Comment ça marche

Le QR code contient une **URL** qui pointe vers votre page `index.html`. Deux modes sont disponibles :

| Mode | Ce que contient le QR | Avantages | Limites |
|------|-----------------------|-----------|---------|
| **Embarqué** (`#d=…`) | Toutes les infos du document, encodées dans le QR | Fonctionne **sans serveur**, même hors-ligne | QR plus dense ; non modifiable après impression |
| **CRM par identifiant** (`?id=…`) | Uniquement l'identifiant du document | QR très simple ; on peut **corriger / révoquer** sans réimprimer | Nécessite de publier un fichier `data/registre.json` |

> Le mode **CRM par identifiant** est celui qui correspond à « **relié à mon CRM** » : votre CRM exporte un fichier `registre.json`, et chaque QR ne porte qu'un identifiant.

---

## 2. Mise en route rapide (5 minutes)

### a) Héberger les pages (GitHub Pages)

1. Poussez ce dépôt sur GitHub.
2. Dans **Settings → Pages**, choisissez la branche (`main`) et le dossier racine (`/`).
3. Votre page sera disponible à une adresse du type :
   `https://VOTRE-COMPTE.github.io/code-qr/`

> Vous pouvez aussi héberger ces fichiers sur n'importe quel serveur web ou votre propre nom de domaine.

### b) Générer les QR codes

1. Ouvrez **`generateur.html`** (en ligne ou en local).
2. Renseignez la **Configuration générale** :
   - **URL de votre page de vérification** = l'adresse ci-dessus (ex. `https://VOTRE-COMPTE.github.io/code-qr/`)
   - **Nom de votre organisme** (ex. `DATA FORMA`)
   - **Mode du QR code** (embarqué ou CRM)
3. Onglet **« 1 stagiaire »** pour un cas unique, ou **« Liste (CSV / JSON) »** pour tous les stagiaires d'un coup.
4. Cliquez sur **Générer**, puis **Imprimer** ou **Télécharger (SVG)** chaque QR.

### c) (Mode CRM uniquement) Publier le registre

En mode **CRM par identifiant**, cliquez sur **« Télécharger registre.json »** dans le générateur, puis placez ce fichier dans `data/registre.json` sur votre hébergement.

---

## 3. Généraliser à tous les stagiaires (depuis le CRM)

Votre CRM doit produire, pour chaque document, les champs suivants. Deux formats sont acceptés à l'import dans le générateur :

### Option A — CSV (le plus simple)

Voir `data/stagiaires.example.csv`. Colonnes reconnues (toutes facultatives **sauf `id`**) :

```
id, beneficiaire, formation, doc, statut, date, sha,
signataire_nom, signataire_role, signataire_email, signataire_ip, signataire_date
```

- Par défaut, le **bénéficiaire** devient le signataire « Stagiaire ».
- Le champ **« Signataire de l'organisme »** (dans la config) est ajouté automatiquement à toutes les lignes (ex. le gérant).

### Option B — JSON (contrôle total)

Un tableau d'objets, un par document. Voir `data/registre.example.json` pour la structure exacte :

```json
[
  {
    "id": "A7B7434617A74",
    "org": "DATA FORMA",
    "doc": "Dossier d'audit",
    "beneficiaire": "JEAN DUPONT",
    "formation": "NEGOCIATION ET DIGITALISATION DE LA RELATION CLIENT (BTS)",
    "statut": "Terminé",
    "date": "05/05/2026",
    "sha": "aa2cdef5…",
    "sigs": [
      { "n": "RESPONSABLE PÉDAGOGIQUE", "r": "Gérant DATA FORMA", "d": "11/05/2026 à 15:02" },
      { "n": "JEAN DUPONT", "r": "Stagiaire", "d": "11/05/2026 à 16:30" }
    ]
  }
]
```

Champs d'un signataire (`sigs[]`) : `n` (nom), `r` (rôle), `d` (date/heure), `mail` (email, facultatif), `ip` (facultatif).

---

## 4. Intégrer directement dans votre application (facultatif)

Si vous générez déjà vos PDF par code, vous pouvez fabriquer l'URL du QR vous-même :

```js
function toB64Url(obj){
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}

const VERIF_URL = "https://VOTRE-COMPTE.github.io/code-qr/";

// Mode embarqué : tout dans le QR
const data = {
  id: documentId,
  org: "DATA FORMA",
  doc: intituleDocument,
  beneficiaire: nomStagiaire,
  formation: intituleFormation,
  statut: statutReel,
  date: dateCreation,
  sigs: signataires.map(s => ({ n: s.nom, r: s.role, d: s.dateHeureEnregistree })),
  sha: hashDesDonneesSignees || undefined
};
const urlEmbarque = VERIF_URL + "#d=" + toB64Url(data);

// OU mode CRM : uniquement l'identifiant
const urlCrm = VERIF_URL + "?id=" + encodeURIComponent(documentId);

// Générez ensuite le QR à partir de `urlEmbarque` ou `urlCrm`
```

---

## 5. Trois points importants pour rester honnête

1. **Les dates/heures** (`sigs[].d`) doivent être les **horodatages réellement enregistrés** au moment de la signature — pas une heure recalculée.
2. **`sha`** doit être une vraie empreinte SHA-256.
   ⚠️ Attention : le QR est dans le PDF, il ne peut donc pas contenir l'empreinte de ce **même** PDF (référence circulaire). Le plus propre est de hacher **les données signées** (et de le libeller ainsi), ou de conserver le fichier de référence côté organisme.
3. La page **n'affiche que ce que vous lui fournissez**. Elle indique explicitement qu'elle **ne constitue pas** une signature électronique qualifiée au sens du règlement (UE) n°910/2014 (eIDAS).

---

## 6. Confidentialité (RGPD)

- Les fichiers `data/*.example.*` contiennent des données **fictives**.
- Le fichier réel `data/registre.json` est **ignoré par git** (`.gitignore`) car il contient des **données personnelles** de stagiaires.
- Si vous utilisez GitHub Pages en mode CRM, publiez ce registre sur un dépôt **privé** ou un hébergement à accès maîtrisé. En mode **embarqué**, ne mettez dans le QR que le strict nécessaire (évitez emails/IP si le document est diffusé largement).

---

## 7. Structure du projet

```
code-qr/
├── index.html                     # Page de vérification (scan du QR)
├── generateur.html                # Générateur de QR (unitaire + en masse)
├── assets/
│   └── qrcode-generator.js        # Librairie QR locale (MIT, K. Arase)
├── data/
│   ├── registre.example.json      # Exemple de registre CRM (données fictives)
│   ├── stagiaires.example.csv     # Exemple d'export CSV (données fictives)
│   └── registre.json              # Votre registre réel (non versionné)
└── README.md
```

---

Librairie QR : [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) de Kazuhiko Arase (licence MIT).
