# Intégration dans le CRM Facturation V2 (Flask)

Ce module lie **chaque stagiaire** (`dossiers`) à une enveloppe de signature vérifiable par QR code.

## 1. Copier le module

Copiez le dossier `integration/crm/` à la racine de votre projet CRM (à côté de `app.py`).

```
votre-crm/
├── app.py
├── integration/
│   └── crm/
│       ├── __init__.py
│       ├── qr_verification.py
│       ├── signature_service.py
│       └── signature_blueprint.py
```

## 2. Installer les dépendances

```bash
pip install -r integration/crm/requirements.txt
```

## 3. Brancher dans `app.py`

Ajoutez **avant** `if __name__ == '__main__':` :

```python
# --- Vérification QR / signatures électroniques ---
from integration.crm import register_signature_module

CODE_QR_DATA = os.path.join(BASE_DIR, '..', 'code-qr', 'data', 'envelopes')
# Chemin vers le dépôt code-qr (sync JSON pour GitHub Pages).
# Adaptez si besoin, ou mettez None pour désactiver l'export fichier.

signature_service = register_signature_module(
    app,
    get_db=get_db,
    output_folder=OUTPUT_FOLDER,
    verif_base_url='https://verifsign.github.io/code-qr/',  # ou votre domaine
    format_date_fr=format_date_fr,
    code_qr_data_dir=CODE_QR_DATA,
)
```

## 4. Workflow pour chaque stagiaire

### Étape A — Créer l'enveloppe (liée au dossier CRM)

```http
POST /api/signature/enveloppe
Content-Type: application/json

{
  "dossier_id": 42,
  "intitule_document": "Dossier d'audit — NEGOCIATION ET DIGITALISATION DE LA RELATION CLIENT (BTS)",
  "generate_qr": false
}
```

Réponse : `{ "envelope_id": "A7B7434617A74", ... }`

Les champs sont pré-remplis depuis le CRM :
- `dossiers.participant` → bénéficiaire
- `dossiers.titre_formation` → document
- `organismes.nom` → organisme

Contraintes appliquées par le service :
- un dossier ne peut avoir qu'une seule enveloppe active (`statut != "Terminé"`) ;
- `dossier_id` est obligatoire et doit correspondre à une ligne existante de `dossiers` ;
- les signataires initiaux ne sont importés que s'ils ont déjà un `signe_le` ou un indicateur `signed`.

### Étape B — Enregistrer chaque signature (horodatage RÉEL)

Quand le gérant signe :

```http
POST /api/signature/enveloppe/A7B7434617A74/signer
{
  "nom": "SITBON RICHARD",
  "role": "Gérant — DATA FORMA",
  "email": "dataforma.direction@gmail.com"
}
```

Quand le stagiaire signe :

```http
POST /api/signature/enveloppe/A7B7434617A74/signer
{
  "nom": "BAPTISTE BLETEAU",
  "role": "Stagiaire",
  "email": "BLETEAU.BAPTISTE@HOTMAIL.COM"
}
```

**Important** : ne passez pas `signe_le` sauf pour réimporter des données historiques.
Sans `signe_le`, le CRM enregistre `datetime.now()` au moment exact de l'appel API.
L'adresse IP stockée vient de `request.remote_addr` dans Flask ; le champ `ip` du JSON n'est utilisé
qu'en secours si Flask ne fournit pas d'adresse.

Une enveloppe scellée refuse toute nouvelle signature (`Enveloppe déjà scellée`).

### Étape C — Sceller + générer le QR

Après toutes les signatures, avec le PDF final (hors QR) :

```http
POST /api/signature/enveloppe/A7B7434617A74/sceller
{
  "pdf_path": "/chemin/vers/attestation_finale.pdf",
  "generate_qr": true
}
```

Réponse :
```json
{
  "url": "https://verifsign.github.io/code-qr/?id=A7B7434617A74",
  "qr_filename": "qr-A7B7434617A74.png",
  "hash_pdf": "aa2cdef5a92cdd62a82cdbcfa72cda3ca62cd8a9a52cd716a42cd583a32cd3f0"
}
```

Insérez `output/qr-A7B7434617A74.png` dans votre PDF d'attestation.

À retenir :
- `generate_qr` vaut `true` par défaut sur `/sceller` ; mettez `false` pour exporter le JSON sans PNG.
- Le SHA-256 est calculé seulement si `pdf_path` pointe vers un fichier accessible au CRM. Sinon
  l'enveloppe est quand même marquée `Terminé`, mais `hash_pdf` reste vide.
- Le scellement exporte aussi le payload JSON si `code_qr_data_dir` est configuré.

### Étape D — Scan

Le QR ouvre la page (mobile + ordinateur) :
- **GitHub Pages** : `https://verifsign.github.io/code-qr/?id=A7B7434617A74`
- **CRM local** : `http://votre-serveur:5050/verify?id=A7B7434617A74`

## 5. API complète

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/signature/enveloppe` | POST | Créer enveloppe pour un `dossier_id` |
| `/api/signature/enveloppe/<id>/signer` | POST | Enregistrer une signature |
| `/api/signature/enveloppe/<id>/sceller` | POST | Terminer + SHA-256 + export JSON |
| `/api/signature/enveloppe/<id>/qr` | POST | Régénérer le QR |
| `/api/signature/enveloppe/<id>` | GET | Payload JSON (page de vérification) |
| `/api/signature/dossier/<id>` | GET | Liste des enveloppes d'un stagiaire |
| `/api/signature/enveloppes` | GET | Liste globale (`?statut=Terminé`) |
| `/verify?id=<id>` | GET | Page de vérification hébergée par le CRM |
| `/api/signature/qr/<filename>` | GET | Télécharger le PNG |

## 6. Formats lus par la page de vérification

La page statique `index.html` sait charger les données de trois façons :

| Source | Exemple | Codepath |
|--------|---------|----------|
| Fichier GitHub Pages | `?id=A7B7434617A74` | lit `data/envelopes/A7B7434617A74.json` |
| API CRM | `?id=A7B7434617A74&api=http://localhost:5050` | appelle `/api/signature/enveloppe/<id>` |
| Payload embarqué | `#d=<base64url>` | décode les données sans fichier serveur |

Le payload exposé par l'API est compact pour garder les QR courts :

```json
{
  "id": "A7B7434617A74",
  "org": "DATA FORMA",
  "doc": "Dossier d'audit — BTS NDRC",
  "statut": "Terminé",
  "beneficiaire": "BAPTISTE BLETEAU",
  "sha": "hash_sha256_si_disponible",
  "sigs": [
    { "n": "SITBON RICHARD", "r": "Gérant — DATA FORMA", "d": "02/07/2026 à 10:15" }
  ]
}
```

`scripts/sync-envelope.mjs` accepte le format CRM lisible (`organisme`, `intituleDocument`,
`hashPdf`, `signataires[].signeLe`) puis écrit ce format compact dans `data/envelopes/`.
Le mode legacy `#d=` reste supporté avec les champs `env`, `stag`, `org`, `sigs` et `seal`.

## 7. Exemple Python (génération attestation)

```python
# Après création du dossier stagiaire en base (dossier_id = 42)
svc = signature_service

r = svc.create_for_dossier(42, intitule_document="Dossier d'audit — BTS NDRC")
eid = r['envelope_id']

svc.record_signature(eid, "SITBON RICHARD", "Gérant — DATA FORMA",
                     email="dataforma.direction@gmail.com")
svc.record_signature(eid, "BAPTISTE BLETEAU", "Stagiaire",
                     email="BLETEAU.BAPTISTE@HOTMAIL.COM")

# Générer d'abord le PDF SANS le QR, puis :
svc.seal_envelope(eid, pdf_path="/chemin/attestation_sans_qr.pdf")
qr = svc.generate_qr(eid)
print("URL QR :", qr['url'])
print("PNG    :", qr['qr_path'])
```

## 8. Modes QR

Le générateur utilise le mode `id` par défaut :

```python
qr = svc.generate_qr(eid)              # https://.../?id=A7B7434617A74
qr_hash = svc.generate_qr(eid, 'hash') # https://.../#d=<payload>
```

Préférez `id` pour GitHub Pages ou l'API CRM : l'URL est courte et le JSON peut être corrigé sans
regénérer le PDF. Utilisez `hash` seulement quand le QR doit être autonome, sans fichier
`data/envelopes/{id}.json` ni API disponible.

## 9. SHA-256 et QR dans le PDF

Le QR est imprimé **dans** le PDF : calculez le hash sur le PDF **avant** d'y insérer le QR,
ou scellez avec le PDF final et indiquez dans l'attestation que l'empreinte porte sur le contenu signé.

## 10. Sync GitHub Pages

Si `code_qr_data_dir` pointe vers `code-qr/data/envelopes/`, chaque scellement exporte
automatiquement `{envelope_id}.json`. Il suffit de commit + push pour mettre à jour la page publique.

## 11. Variables d'environnement

| Variable | Défaut | Usage |
|----------|--------|-------|
| `VERIF_BASE_URL` | `https://verifsign.github.io/code-qr/` | URL encodée dans le QR |

## 12. Dépannage rapide

| Symptôme | Vérification |
|----------|--------------|
| `Document introuvable` sur GitHub Pages | Confirmer que `data/envelopes/<id>.json` existe et que l'URL utilise exactement le même `id`. |
| `Document introuvable` avec `&api=` | Tester `/api/signature/enveloppe/<id>` côté CRM et vérifier que l'URL `api` n'a pas de slash final obligatoire. |
| QR généré mais SHA vide | Vérifier que `pdf_path` existe sur le serveur Flask au moment de `/sceller`. |
| Nouvelle signature refusée | L'enveloppe est déjà `Terminé`; créer une nouvelle enveloppe pour modifier le cycle de signature. |
| JSON exporté mais page vide | Vérifier que les signataires contiennent `d`, `signeLe` ou `signedAt` dans les données source. |
