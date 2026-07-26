# Automatiser le remplissage des CERFA (OPCO Commerce / Opcommerce)

Ce module ajoute au CRM la génération automatique de formulaires **CERFA
pré-remplis** (ex. Cerfa 10103 « Contrat d'apprentissage ») à partir des
données déjà saisies dans un `dossier` (stagiaire), afin de réduire la
ressaisie avant transmission à l'OPCO (Opcommerce, etc.).

## Deux niveaux d'automatisation possibles

| Niveau | Ce que ça fait | Prérequis | Statut dans ce dépôt |
|---|---|---|---|
| **1. PDF pré-rempli** | Génère le CERFA en PDF avec les champs remplis depuis le CRM, prêt à relire/signer et déposer sur le portail *Web Services Partenaire* de l'OPCO | Le fichier CERFA officiel (PDF avec champs de formulaire) | ✅ Implémenté (`cerfa_service.py`, `cerfa_blueprint.py`) |
| **2. Transmission directe API Convergence** | Envoie les données du contrat directement à l'OPCO, sans PDF, via la norme nationale « API Convergence CFA/OPCO » | Compte CFA partenaire + clé `CFA_KEY` + spec OpenAPI (portail [cfadock.fr](https://www.cfadock.fr/portail_developpeur)) + mandat de gestion de l'entreprise | 🚧 Squelette fourni (`convergence_client.py`), à compléter avec la spec réelle |

Commencez par le niveau 1 (utilisable immédiatement), et migrez vers le
niveau 2 si vous voulez éliminer entièrement la ressaisie côté portail OPCO.

## Niveau 1 — Génération du PDF pré-rempli

### 1. Récupérer le CERFA officiel

Téléchargez le formulaire CERFA à jour (ex. **10103\*14** pour le contrat
d'apprentissage, ou la convention de formation professionnelle continue
selon votre besoin) depuis service-public.fr, et placez-le dans un dossier
`cerfa_templates/` à côté de `app.py` du CRM.

### 2. Découvrir les vrais noms de champs de CE fichier

Les noms de champs internes changent d'une version de PDF à l'autre : il
faut les lire directement sur votre fichier, pas les deviner.

```bash
python -m integration.crm.cerfa_cli champs cerfa_templates/cerfa_10103.pdf
```

ou, une fois branché dans le CRM :

```http
GET /api/cerfa/champs?template=cerfa_10103.pdf
```

### 3. Écrire le mapping (dossier CRM → champs CERFA)

Copiez `integration/crm/cerfa/mappings/exemple_cerfa_apprentissage.json`,
renommez-le, et remplacez les clés par les vrais noms de champs trouvés à
l'étape 2. Les valeurs sont des gabarits `{{a.b.c}}` résolus depuis :

- `dossier.*` — colonnes de la table `dossiers` (participant, titre_formation, …)
- `organisme.*` — nom/gérant de l'organisme rattaché au dossier
- `extra.*` — toute donnée complémentaire non stockée dans le CRM (SIRET
  employeur, maître d'apprentissage, dates de contrat…), passée à l'appel

Adaptez `CerfaService._default_row_to_context` (ou passez votre propre
fonction `row_to_context` au constructeur) si le schéma de votre CRM diffère.

### 4. Brancher le module Flask

Dans `app.py`, à côté de `register_signature_module` :

```python
from integration.crm import register_cerfa_module

cerfa_service = register_cerfa_module(
    app, get_db,
    templates_dir=os.path.join(BASE_DIR, 'cerfa_templates'),
    mappings_dir=os.path.join(BASE_DIR, 'integration', 'crm', 'cerfa', 'mappings'),
    output_folder=OUTPUT_FOLDER,
)
```

### 5. Générer un CERFA pour un dossier

```http
POST /api/cerfa/dossier/42/generer
Content-Type: application/json

{
  "template": "cerfa_10103.pdf",
  "mapping": "mon_mapping_apprentissage.json",
  "extra": {
    "employeur": {"siret": "123 456 789 00012", "adresse": "1 rue X, 75000 Paris"},
    "maitre_apprentissage": {"nom": "DUPONT", "prenom": "Jean"},
    "contrat": {"date_debut": "01/09/2026", "date_fin": "31/08/2028"}
  }
}
```

Réponse : `{ "success": true, "fichier": "cerfa-dossier-42.pdf", ... }`, puis :

```http
GET /api/cerfa/telecharger/cerfa-dossier-42.pdf
```

Le PDF généré reste éditable (champs non figés) tant que
`"flatten": true` n'est pas passé — pratique pour une relecture/correction
avant impression et signature, comme l'exige la réglementation (le CERFA
signé original doit être conservé par l'employeur et l'apprenti).

### 6. Déposer sur le portail OPCO

Une fois signé, déposez le PDF sur le portail *Web Services Partenaire* de
votre OPCO (ex. `lopcommerce.com`, espace « Nouveau dossier » /
« Dépôt de documents »), comme vous le feriez manuellement — seule la saisie
des champs a été automatisée.

## Niveau 2 — API Convergence (transmission directe, sans PDF)

Les OPCO (dont Opcommerce) exposent une API REST standardisée nationale,
l'**API Convergence CFA/OPCO**, qui permet de transmettre les données CERFA
directement depuis un logiciel de gestion, sans ressaisie sur le portail web.

Pour l'activer :

1. Ouvrez un compte « Web Services Partenaire » chez l'OPCO cible et
   récupérez votre clé `CFA_KEY` (procédure documentée par l'OPCO, ex.
   « Mode Opératoire de récupération de la clé API » sur lopcommerce.com).
2. Téléchargez la spécification OpenAPI à jour sur le portail développeur
   national : <https://www.cfadock.fr/portail_developpeur>. C'est la source
   de vérité pour les URLs d'authentification/transmission et le schéma JSON
   exact attendu (différent des noms de champs du PDF CERFA).
3. Renseignez les variables d'environnement :

   | Variable | Description |
   |---|---|
   | `CONVERGENCE_BASE_URL` | URL racine de l'API de l'OPCO |
   | `CONVERGENCE_TOKEN_URL` | Endpoint OAuth2 (client credentials) |
   | `CONVERGENCE_CLIENT_ID` / `CONVERGENCE_CLIENT_SECRET` | Identifiants OAuth2 |
   | `CONVERGENCE_CFA_KEY` | Clé CFA obtenue à l'étape 1 |

4. Complétez `convergence_client.py` :
   - l'URL/le payload exacts de `transmit_cerfa()` d'après la spec OpenAPI,
   - `build_convergence_payload_from_dossier()` pour mapper le contexte
     dossier CRM vers le schéma JSON Convergence (équivalent du mapping
     JSON du niveau 1, mais pour un payload API plutôt qu'un PDF).

⚠️ **Prérequis réglementaire** : transmettre un contrat au nom d'une
entreprise suppose un **mandat de gestion** donné par celle-ci au CFA. Le
CERFA signé doit rester disponible (dématérialisé) en cas de contrôle, même
si la transmission à l'OPCO se fait par API.

## Fichiers de ce module

```
cerfa_service.py       Introspection + remplissage de PDF AcroForm (générique)
cerfa_blueprint.py      Routes Flask (/api/cerfa/...)
cerfa_cli.py            CLI de test sans dépendance au CRM
convergence_client.py   Squelette client API Convergence (à compléter)
cerfa/mappings/         Exemples de mapping dossier CRM -> champs CERFA
```
