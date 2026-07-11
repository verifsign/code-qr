# code-qr — Page de vérification de documents signés

Quand quelqu'un scanne le QR code imprimé sur une attestation (téléphone ou ordinateur),
il arrive sur une page web qui affiche les informations enregistrées lors de la signature :
identifiant du dossier, organisme, signataires, dates de signature, empreinte, etc.

Le système est **généralisé pour tous les stagiaires** : les données de chaque dossier sont
encodées dans l'URL du QR code (fragment `#d=...` en base64url). Une seule page hébergée
suffit, aucune base de données n'est nécessaire côté page.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Page de vérification affichée quand on scanne le QR code. À héberger. |
| `generateur.html` | Outil manuel : formulaire pour saisir un dossier et générer le QR (PNG téléchargeable). |
| `crm-integration.js` | Fonctions à brancher dans votre CRM pour générer automatiquement l'URL et le QR pour chaque stagiaire. |

## 1. Héberger la page (GitHub Pages, gratuit)

1. Sur GitHub, ouvrez ce dépôt → **Settings** → **Pages**.
2. Dans *Build and deployment*, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
3. Après une à deux minutes, la page est en ligne à l'adresse :
   `https://<votre-compte>.github.io/code-qr/`
4. C'est cette adresse qu'il faut utiliser comme `VERIF_URL`. Vous pouvez aussi y brancher
   un nom de domaine à vous (Settings → Pages → Custom domain) pour que l'URL soit au nom
   de votre organisme.

## 2. Générer un QR manuellement

Ouvrez `generateur.html` (en ligne à `https://<votre-compte>.github.io/code-qr/generateur.html`
ou en local), renseignez l'URL de la page de vérification et les données réelles du dossier,
puis téléchargez le PNG du QR et insérez-le dans le PDF.

## 3. Brancher le CRM (automatique, pour tous les stagiaires)

Dans le code du CRM, à l'endroit où le PDF d'attestation est généré :

```js
const { buildVerificationUrl } = require("./crm-integration.js");
// (ou <script src="crm-integration.js"></script> côté navigateur)

const url = buildVerificationUrl({
  id:        enveloppe.reference,          // identifiant réel du dossier
  organisme: "VOTRE ORGANISME",
  document:  enveloppe.titre,
  stagiaire: stagiaire.nomComplet,
  statut:    enveloppe.statut,             // ex. "Terminé"
  signataires: enveloppe.signatures.map(s => ({
    nom:      s.signataire.nomComplet,
    role:     s.signataire.role,
    signedAt: s.signedAt,                  // horodatage enregistré à la signature
    email:    s.signataire.email,
    ip:       s.ipEnregistree,
  })),
});

// Puis générer le QR à partir de `url` avec votre lib QR habituelle, ex. :
// QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 2 })
```

N'oubliez pas de remplacer `VERIF_URL` en tête de `crm-integration.js` par l'adresse réelle
de votre page hébergée.

## 4. Règles pour que les informations soient vraies

- **Dates de signature** : utilisez les horodatages réellement enregistrés en base au moment
  où chaque personne signe (`signedAt`), jamais des valeurs calculées ou dérivées du nom.
- **Empreinte SHA-256** : le QR est inséré dans le PDF final, il ne peut donc pas contenir
  l'empreinte de ce même PDF (référence circulaire). Hachez le document source ou les
  données signées (fonction `sha256Hex` fournie) et libellez-le ainsi (`shaNote`).
- **Mentions réglementaires** : la page indique explicitement qu'elle ne constitue pas une
  signature électronique qualifiée au sens du règlement eIDAS. N'ajoutez pas de mention de
  conformité (eIDAS, ISO 27001…) que vous ne pouvez pas justifier.

## Limites

- La taille d'un QR code est limitée : plus vous encodez de champs, plus le QR est dense et
  difficile à scanner. En cas de problème, retirez les champs optionnels (e-mails, IP, empreinte).
- Une page statique affiche les données encodées dans le QR ; elle ne peut pas, à elle seule,
  prouver l'intégrité du document. Pour une vraie preuve, il faut stocker les dossiers côté
  serveur et faire vérifier l'empreinte par le serveur.
