# Verification QR pour documents stagiaires

Ce depot contient une page statique de verification (`index.html`) et un helper (`qr-url.js`) pour generer les URLs a placer dans les QR codes de vos attestations.

## Objectif

Quand une personne scanne le QR code sur telephone ou ordinateur, elle arrive sur une page responsive qui affiche les informations enregistrees dans votre CRM de controle :

- identifiant reel du document ;
- organisme emetteur ;
- intitule du document ;
- statut reel ;
- signataires et horodatages reels ;
- empreinte SHA-256 du document ou des donnees signees, si elle existe.

La page n'invente aucune information. Les champs affiches doivent venir de votre CRM ou du systeme qui enregistre la signature.

## Utilisation rapide avec donnees embarquees dans le QR

Cette approche marche sans backend public : le QR contient directement les donnees de verification.

```html
<script src="./qr-url.js"></script>
<script>
  const VERIF_URL = "https://votre-domaine.example/";

  const data = {
    id: documentId,
    org: organismeNom,
    doc: intituleDocument,
    statut: statutReel,
    sigs: signataires.map((s) => ({
      n: s.nom,
      r: s.role,
      d: s.signedAt // horodatage reel enregistre en base
    })),
    hash: {
      label: "Empreinte SHA-256 des donnees signees",
      value: hashDonneesSignees
    },
    source: "CRM"
  };

  const url = QrVerificationUrl.buildVerificationUrl(VERIF_URL, data);
  // Passez ensuite `url` a votre generateur QR habituel.
</script>
```

## Utilisation avec un endpoint CRM

Cette approche est preferable si vous voulez que le QR reste court et que les informations soient toujours relues depuis le CRM.

1. Hebergez `index.html` sur votre domaine.
2. Configurez l'endpoint public de lecture avant le script principal, ou directement dans la page :

```html
<script>
  window.VERIFICATION_CONFIG = {
    crmEndpoint: "https://votre-crm.example/api/public/document-verification"
  };
</script>
```

3. Generez le QR avec une URL courte :

```js
const url = QrVerificationUrl.buildVerificationUrlFromCrmId(
  "https://votre-domaine.example/",
  documentId
);
```

L'endpoint CRM doit repondre en JSON avec ce type de structure :

```json
{
  "id": "DOC-2026-0001",
  "org": "Votre organisme",
  "doc": "Attestation de stage",
  "statut": "Termine",
  "sigs": [
    {
      "n": "Nom du signataire",
      "r": "Responsable",
      "d": "2026-07-11 14:33"
    }
  ],
  "hash": {
    "label": "Empreinte SHA-256 des donnees signees",
    "value": "..."
  },
  "source": "CRM"
}
```

## Point important sur le SHA-256

Si le QR est imprime dans le PDF, il ne peut pas contenir l'empreinte SHA-256 finale de ce meme PDF : l'ajout du QR change le fichier, donc son empreinte change aussi.

Deux solutions propres :

- stocker le PDF final cote serveur et faire verifier l'empreinte via le CRM ;
- hacher les donnees signees ou une version canonique du document avant insertion du QR, puis afficher clairement ce libelle.

## Champs acceptes par la page

La page accepte les noms courts (`id`, `org`, `doc`, `statut`, `sigs`, `hash`) et quelques alias pratiques (`documentId`, `organisme`, `signataires`, `signedAt`, `sha256`, etc.) pour faciliter le branchement avec un CRM existant.
