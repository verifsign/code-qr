# Changer l'URL du QR : didohss93 → verifsign

Votre CRM génère déjà des PDF avec un QR au format `#d=...`.  
**Il suffit de changer une ligne** : l'adresse de base. Le reste (données encodées) reste identique.

## Remplacement à faire dans votre CRM

Cherchez dans le code qui génère l'attestation / le QR :

```javascript
// AVANT
const VERIF_URL = "https://didohss93-gif.github.io/signelecverif/";
```

```javascript
// APRÈS
const VERIF_URL = "https://verifsign.github.io/code-qr/";
```

Puis gardez la même construction d'URL :

```javascript
const data = {
  env:  envelopeId,        // ex. A7B7434617A74
  stag: nomStagiaire,      // ex. BAPTISTE BLETEAU
  org:  organismeNom,      // ex. DATA FORMA
  sigs: signataires.map(s => ({
    n: s.nom,
    r: s.role,
    d: s.dateHeureEnregistree   // horodatage RÉEL
  })),
  seal: dateScellement       // ex. 11/07/2026 à 17:31
};

const url = VERIF_URL + "#d=" + toB64Url(data);
```

## Exemple d'URL finale

**Avant :**
```
https://didohss93-gif.github.io/signelecverif/#d=eyJlbnYiOi...
```

**Après :**
```
https://verifsign.github.io/code-qr/#d=eyJlbnYiOi...
```

Le bloc `#d=eyJlbnYiOi...` **ne change pas** — seul le domaine change.

## Python (si votre CRM utilise Python pour le QR)

```python
VERIF_URL = "https://verifsign.github.io/code-qr/"

data = {
    "env": envelope_id,
    "stag": nom_stagiaire,
    "org": organisme_nom,
    "sigs": [{"n": s["nom"], "r": s["role"], "d": s["signe_le"]} for s in signataires],
    "seal": date_scellement,
}

from integration.crm.qr_verification import encode_payload
url = VERIF_URL + "#d=" + encode_payload(data)
```

## Vérification

Après déploiement GitHub Pages sur `verifsign/code-qr`, testez :

https://verifsign.github.io/code-qr/#d=eyJlbnYiOiJBN0I3NDM0NjE3QTc0Iiwic3RhZyI6IkJBUFRJU1RFIEJMRVRFQVUiLCJvcmciOiJEQVRBIEZPUk1BIiwic2lncyI6W3sibiI6IlNJVEJPTiBSSUNIQVJEIiwiciI6IkfDqXJhbnQiLCJkIjoiMTEvMDUvMjAyNiDDoCAxNTowMiJ9LHsibiI6IkJBUFRJU1RFIEJMRVRFQVUiLCJyIjoiU3RhZ2lhaXJlIiwiZCI6IjExLzA1LzIwMjYgw6AgMTY6MzAifV0sInNlYWwiOiIxMS8wNy8yMDI2IMOgIDE3OjMxIn0

Vous devez voir : BAPTISTE BLETEAU, DATA FORMA, les 2 signataires, statut Terminé.

## Déploiement GitHub Pages (verifsign)

1. Merger ce dépôt sur `main`
2. GitHub → repo `verifsign/code-qr` → **Settings → Pages**
3. Source : branche `main`, dossier `/ (root)`
4. Attendre 1–2 min → l'URL `https://verifsign.github.io/code-qr/` est active

## Anciens PDF déjà imprimés

Les PDF déjà générés avec l'ancien lien `didohss93` continueront de pointer vers l'ancienne page tant que ce dépôt reste en ligne. Seuls les **nouveaux** PDF générés après le changement de `VERIF_URL` utiliseront verifsign.
