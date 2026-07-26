# Remplissage automatique du CERFA 10103*14 — dépôt l'Opcommerce

Génère un **CERFA contrat d'apprentissage (10103*14 / FA13) pré-rempli** à partir d'un
dossier JSON (export CRM), prêt à signer puis à déposer sur le portail de l'Opcommerce.

## Ce qui est automatisable (et comment)

| Étape | Automatisation | Outil |
|-------|----------------|-------|
| 1. Remplissage du CERFA | **Totale** — ce module remplit les ~120 champs du PDF officiel | `python -m integration.cerfa` |
| 2. Dépôt du dossier à l'Opcommerce (entreprise) | Manuelle — dépôt du PDF + pièces sur le portail [Web Services Entreprise](https://ws-entreprise.lopcommerce.com) | Portail WSE |
| 3. Transmission automatisée (CFA mandaté) | **Totale** — l'[API Convergence](https://www.lopcommerce.com/prestataire-de-formation/collaborer-avec-l-opcommerce/api-convergence/) (inter-OPCO) transmet les données CERFA directement depuis votre SI | API Convergence + clé `CFA_KEY` |

Points de vigilance l'Opcommerce :

- Le dépôt est **exclusivement dématérialisé** (aucun envoi postal accepté).
- Transmission au plus tard **5 jours ouvrables** après le début d'exécution du contrat.
- Le **code IDCC** et le **code RNCP actif** sont les causes de rejet les plus fréquentes.
- Pour l'API Convergence : mandat de gestion de l'entreprise requis, clé `CFA_KEY` à
  générer depuis le Web Services Partenaire, puis échanges au protocole inter-OPCO.
  Les avenants, conventions et ruptures restent à déposer sur le Web Services Partenaire.

## Installation

```bash
pip install -r integration/cerfa/requirements.txt   # pypdf
```

Le CERFA vierge officiel est embarqué dans `modeles/cerfa_10103-14.pdf`.
Pour re-télécharger la dernière version depuis service-public.gouv.fr :

```bash
python -m integration.cerfa --telecharger-modele
```

## Utilisation

### Ligne de commande

```bash
python -m integration.cerfa --dossier integration/cerfa/exemple-dossier.json \
                            --sortie output/cerfa-DURAND.pdf
```

### Depuis le CRM Flask

```python
from integration.cerfa import remplir_cerfa

dossier = {
    "employeur": {"type": "prive", "denomination": "...", "siret": "...", ...},
    "apprenti": {"nomNaissance": "...", "dateNaissance": "2004-12-15", ...},
    ...
}
remplir_cerfa(dossier, sortie=f"output/cerfa-{dossier_id}.pdf")
```

## Format du dossier JSON

Voir [`exemple-dossier.json`](exemple-dossier.json) pour un dossier complet. Structure :

| Bloc | Contenu |
|------|---------|
| `modeContractuel` | Code 1 à 4 (voir notice 51649#09) |
| `employeur` | `type` (`prive`/`public`), dénomination, SIRET, type d'employeur, adresse, APE, effectif, IDCC |
| `apprenti` | État civil, NIR, `dateNaissance`, `sexe` (`M`/`F`), adresse, situation avant contrat, diplômes, booléens (sportif haut niveau, RQTH, etc.) |
| `representantLegal` | Si apprenti mineur non émancipé |
| `maitresApprentissage` | Liste de 1 ou 2 maîtres (nom, prénom, date de naissance, emploi, diplôme) |
| `contrat` | Type, dates, durée hebdo, `remuneration` (4 années × 2 périodes : `du`, `au`, `pourcentage`, `reference` SMIC/SMC), salaire brut, avantages en nature |
| `formation` | CFA (dénomination, UAI, SIRET, codes diplôme/RNCP, adresse), dates, durée en heures, lieu de formation |
| `attestations` | `maitreApprentissageEligible`, `piecesJustificatives` |
| `signature.faitA` | Ville de signature |

Conventions :

- **Dates** : `AAAA-MM-JJ` (ISO) ou `JJ/MM/AAAA` — découpées automatiquement en cases jour/mois/année.
- **Montants** : `"486.49"` ou `"486,49"` — découpés en euros/centimes.
- **Booléens** : `true`/`false` cochent la case Oui ou Non ; `null` ou absent laisse vide.
- Les champs codifiés (type d'employeur, situation avant contrat, diplômes…) attendent
  les codes de la [notice 51649#09](https://www.formulaires.service-public.gouv.fr/gf/getNotice.do?cerfaFormulaire=10103&cerfaNotice=51649).

## Maintenance : nouvelle version du CERFA

Quand une version 10103*15 sortira :

1. `python -m integration.cerfa --telecharger-modele`
2. `python -m integration.cerfa --lister-champs` pour comparer les noms de champs
3. Ajuster `mapping_10103_14.py` si les noms ont changé — le script échoue explicitement
   si un champ mappé n'existe plus dans le PDF.

## Fichiers

```
fill_cerfa.py          Remplissage + CLI (téléchargement du modèle, listing des champs)
mapping_10103_14.py    Mapping clé sémantique -> nom de champ PDF (216 champs relevés)
exemple-dossier.json   Dossier JSON complet d'exemple
modeles/cerfa_10103-14.pdf  CERFA vierge officiel (service-public.gouv.fr)
```
