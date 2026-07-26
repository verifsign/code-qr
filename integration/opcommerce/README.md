# Automatisation CERFA — Portail OPCOMMERCE

Module Python + Playwright pour **remplir automatiquement** les formulaires de
demande de prise en charge sur le portail OPCOMMERCE, à partir des données du
CRM DATA FORMA.

---

## Formulaires supportés

| Code       | Intitulé                                      | CERFA de référence |
|------------|-----------------------------------------------|--------------------|
| `PDC`      | Plan de Développement des Compétences         | 10103              |
| `PRO_A`    | Reconversion ou Promotion par Alternance      | —                  |
| `APPRENTISSAGE` | Contrat d'apprentissage                  | 10103 / FA         |
| `AFPR`     | Action de Formation Préalable au Recrutement  | —                  |

---

## Installation

```bash
# Depuis la racine du projet
pip install -r integration/opcommerce/requirements.txt
playwright install chromium
```

---

## Configuration des identifiants

Deux méthodes (par ordre de priorité) :

### 1. Variables d'environnement (recommandé)

```bash
export OPCOMMERCE_LOGIN="mon.email@entreprise.fr"
export OPCOMMERCE_PASSWORD="motdepasse_opcommerce"
```

### 2. Paramètres Python

```python
filler = OpcommerceFiller(login="...", password="...")
```

---

## Utilisation en ligne de commande

### Depuis un fichier JSON

```bash
python scripts/fill-cerfa.py \
  --file integration/opcommerce/examples/dossier-pdc.json

# Apprentissage
python scripts/fill-cerfa.py \
  --file integration/opcommerce/examples/dossier-apprentissage.json \
  --type-cerfa APPRENTISSAGE
```

### Depuis la base CRM

```bash
python scripts/fill-cerfa.py \
  --dossier-id 42 \
  --crm-db /chemin/vers/crm.db
```

### Mode débogage (navigateur visible + captures d'écran)

```bash
python scripts/fill-cerfa.py \
  --file dossier.json \
  --visible \
  --screenshots /tmp/cerfa_debug \
  --dry-run        # Remplit mais ne soumet pas
```

---

## Utilisation dans le CRM Flask

```python
from integration.opcommerce import CerfaMapper, OpcommerceFiller

# 1. Construire le payload depuis un dossier CRM
dossier = {
    "participant":              "BAPTISTE BLETEAU",
    "titre_formation":          "BTS NDRC",
    "date_debut":               "2026-09-01",
    "date_fin":                 "2027-06-30",
    "nb_heures":                1200,
    "cout_pedagogique":         8500,
    "organisme_nom":            "DATA FORMA",
    "organisme_nda":            "11930811093",
    "organisme_siret":          "89233588100019",
    "employeur_raison_sociale": "SARL EXEMPLE",
    "employeur_siret":          "12345678901234",
    "stagiaire_nom":            "BLETEAU",
    "stagiaire_prenom":         "BAPTISTE",
    "stagiaire_naissance":      "2005-03-22",
}

mapper  = CerfaMapper(type_cerfa="PDC")
payload = mapper.map(dossier)

# 2. Vérifier les champs obligatoires
manquants = mapper.validate(payload)
if manquants:
    raise ValueError(f"Champs manquants : {manquants}")

# 3. Remplir le portail OPCOMMERCE
filler = OpcommerceFiller(headless=True)   # credentials via variables d'env
result = filler.fill(payload)

if result["success"]:
    print("Référence OPCOMMERCE :", result["reference"])
else:
    print("Erreur :", result["erreur"])
```

---

## Structure des fichiers

```
integration/opcommerce/
├── __init__.py            Points d'entrée publics
├── cerfa_mapper.py        Mapping données CRM → champs CERFA
├── opcommerce_filler.py   Automatisation Playwright du portail
├── requirements.txt       Dépendances Python
├── README.md              Ce fichier
└── examples/
    ├── dossier-pdc.json          Exemple PDC complet
    └── dossier-apprentissage.json Exemple apprentissage complet

scripts/
└── fill-cerfa.py          Script CLI
```

---

## Champs CRM reconnus automatiquement

Le `CerfaMapper` accepte plusieurs variantes de noms de champ pour chaque donnée.
Voici les correspondances principales :

| Donnée                  | Clés CRM acceptées                                              |
|-------------------------|-----------------------------------------------------------------|
| Nom participant         | `stagiaire_nom`, `nom_stagiaire`, `participant` (auto-split)   |
| Prénom participant      | `stagiaire_prenom`, `prenom_stagiaire`, `participant` (auto-split) |
| Date de naissance       | `stagiaire_naissance`, `date_naissance`, `naissance`           |
| Titre de la formation   | `titre_formation`, `intitule_formation`, `intituleDocument`    |
| Date début              | `date_debut`, `dateDebut`, `date_debut_formation`              |
| Date fin                | `date_fin`, `dateFin`, `date_fin_formation`                    |
| Durée (heures)          | `nb_heures`, `duree_heures`, `heures`                          |
| Coût pédagogique        | `cout_pedagogique`, `cout`, `montant_ht`                       |
| Nom organisme           | `organisme_nom`, `organisme`, `org_nom`                        |
| NDA organisme           | `organisme_nda`, `nda`                                         |
| SIRET organisme         | `organisme_siret`, `siret_organisme`                           |
| Raison sociale employeur| `employeur_raison_sociale`, `employeur_nom`, `raison_sociale`  |
| SIRET employeur         | `employeur_siret`, `siret_employeur`, `siret`                  |

Les dates sont automatiquement converties au format français **JJ/MM/AAAA**
(depuis ISO 8601, `AAAA-MM-JJ`, ou d'autres formats courants).

---

## Adapter aux changements du portail OPCOMMERCE

Si OPCOMMERCE modifie sa structure HTML, editez les sélecteurs CSS dans
`opcommerce_filler.py` → méthodes `_fill_pdc`, `_fill_pro_a`, etc.

Chaque appel à `_fill_field(page, [sélecteur1, sélecteur2, ...], valeur)`
essaie les sélecteurs dans l'ordre et s'arrête au premier champ visible trouvé.

Pour identifier les sélecteurs exacts d'un champ :
1. Lancez avec `--visible --dry-run`
2. Ouvrez les DevTools (F12) et inspectez le champ HTML
3. Copiez le `name`, `id` ou attribut `data-*`
4. Mettez à jour la liste de sélecteurs dans `opcommerce_filler.py`

---

## Sécurité

- Ne commitez **jamais** vos identifiants OPCOMMERCE dans le dépôt.
- Utilisez des variables d'environnement ou un gestionnaire de secrets.
- En production, utilisez `headless=True` (par défaut).
