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

## 6. Exemple Python (génération attestation)

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

## 7. SHA-256 et QR dans le PDF

Le QR est imprimé **dans** le PDF : calculez le hash sur le PDF **avant** d'y insérer le QR,
ou scellez avec le PDF final et indiquez dans l'attestation que l'empreinte porte sur le contenu signé.

## 8. Sync GitHub Pages

Si `code_qr_data_dir` pointe vers `code-qr/data/envelopes/`, chaque scellement exporte
automatiquement `{envelope_id}.json`. Il suffit de commit + push pour mettre à jour la page publique.

## 9. Variables d'environnement

| Variable | Défaut | Usage |
|----------|--------|-------|
| `VERIF_BASE_URL` | `https://verifsign.github.io/code-qr/` | URL encodée dans le QR |

## 10. Automatiser le remplissage des CERFA (OPCO Commerce)

Pour générer automatiquement les formulaires CERFA (ex. contrat
d'apprentissage) à partir des dossiers du CRM, avant transmission à
l'OPCO : voir [`CERFA.md`](CERFA.md).
