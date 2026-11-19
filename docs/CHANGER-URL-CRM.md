# Changer l'URL du QR : utiliser un identifiant serveur

Les anciens QR au format `#d=...` embarquaient toutes les données dans l'URL. Ce format est désactivé, car n'importe qui pouvait modifier ces données puis afficher une fausse attestation vérifiée.

## Remplacement à faire dans votre CRM

Générez désormais une URL courte qui contient uniquement l'identifiant de l'enveloppe enregistrée côté serveur :

```javascript
const VERIF_URL = "https://verifsign.github.io/code-qr/";
const url = VERIF_URL + "?id=" + encodeURIComponent(envelopeId);
```

Publiez en parallèle la fiche JSON correspondante dans `data/envelopes/{envelopeId}.json`, ou servez les données via l'API CRM configurée.

## Exemple d'URL finale

```
https://verifsign.github.io/code-qr/?id=A7B7434617A74
```

## Python (si votre CRM utilise Python pour le QR)

```python
VERIF_URL = "https://verifsign.github.io/code-qr/"
url = VERIF_URL + "?id=" + envelope_id
```

## Vérification

Après déploiement GitHub Pages sur `verifsign/code-qr`, testez :

https://verifsign.github.io/code-qr/?id=A7B7434617A74

Vous devez voir : BAPTISTE BLETEAU, DATA FORMA, les 2 signataires, statut Terminé.

## Déploiement GitHub Pages (verifsign)

1. Merger ce dépôt sur `main`
2. GitHub → repo `verifsign/code-qr` → **Settings → Pages**
3. Source : branche `main`, dossier `/ (root)`
4. Attendre 1–2 min → l'URL `https://verifsign.github.io/code-qr/` est active

## Anciens PDF déjà imprimés

Les PDF déjà générés avec un lien `#d=...` ne doivent pas être utilisés comme preuve vérifiée. Régénérez leur QR avec une URL `?id=...` quand une vérification fiable est nécessaire.
