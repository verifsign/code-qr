"""
Client pour l'API Convergence CFA/OPCO (norme inter-OPCO, ex. Opcommerce/OPCO
Commerce) — transmission directe des données CERFA sans passer par un PDF.

⚠️ Ce module est un SQUELETTE à compléter. L'API Convergence est une norme
nationale (REST + OAuth2) portée par le portail développeur cfadock.fr :
    https://www.cfadock.fr/portail_developpeur
Ce portail publie la spécification OpenAPI officielle (à jour, versionnée),
les règles de gestion communes, et l'état d'implémentation par OPCO. Il faut :

1. Être identifié comme CFA (Centre de Formation d'Apprentis) partenaire
   de l'OPCO cible (ex. Opcommerce) et disposer d'un compte
   « Web Services Partenaire ».
2. Récupérer la clé d'authentification CFA_KEY depuis ce compte
   (voir « Mode Opératoire de récupération de la clé API » sur le site
   de l'OPCO, ex. lopcommerce.com/prestataire-de-formation/collaborer-avec-l-opcommerce/api-convergence/).
3. Télécharger la spec OpenAPI courante sur cfadock.fr et l'utiliser pour :
   - renseigner `token_url` / `transmit_cerfa_url` ci-dessous,
   - construire le payload exact attendu (les noms de champs JSON de la
     norme Convergence, différents des noms de champs du PDF CERFA).
4. Obtenir, le cas échéant, un mandat de gestion de l'entreprise employeur
   avant toute transmission automatisée en son nom (obligation réglementaire).

Tant que ces éléments ne sont pas renseignés, préférez le module
`cerfa_service.py` (génération d'un PDF pré-rempli à déposer manuellement
sur le portail Web Services Partenaire de l'OPCO).
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any

import requests


class ConvergenceConfigError(RuntimeError):
    """Levée quand la configuration API Convergence est incomplète."""


@dataclass
class ConvergenceClient:
    base_url: str = field(default_factory=lambda: os.environ.get('CONVERGENCE_BASE_URL', ''))
    cfa_key: str = field(default_factory=lambda: os.environ.get('CONVERGENCE_CFA_KEY', ''))
    client_id: str = field(default_factory=lambda: os.environ.get('CONVERGENCE_CLIENT_ID', ''))
    client_secret: str = field(default_factory=lambda: os.environ.get('CONVERGENCE_CLIENT_SECRET', ''))
    token_url: str = field(default_factory=lambda: os.environ.get('CONVERGENCE_TOKEN_URL', ''))
    timeout: int = 30

    _token: str | None = field(default=None, init=False, repr=False)

    def _require_config(self) -> None:
        missing = [name for name, val in (
            ('CONVERGENCE_BASE_URL', self.base_url),
            ('CONVERGENCE_CFA_KEY', self.cfa_key),
            ('CONVERGENCE_TOKEN_URL', self.token_url),
        ) if not val]
        if missing:
            raise ConvergenceConfigError(
                'Configuration API Convergence incomplète, variables manquantes : '
                + ', '.join(missing)
                + '. Voir la documentation dans convergence_client.py / CERFA.md.'
            )

    def _get_token(self) -> str:
        """OAuth2 client-credentials — URL et paramètres exacts à confirmer
        via la spec OpenAPI (cfadock.fr) une fois votre CFA_KEY obtenue."""
        if self._token:
            return self._token
        self._require_config()
        resp = requests.post(
            self.token_url,
            data={
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret,
            },
            timeout=self.timeout,
        )
        resp.raise_for_status()
        self._token = resp.json()['access_token']
        return self._token

    def transmit_cerfa(self, payload: dict) -> dict:
        """Transmet un dossier CERFA (apprentissage) à l'OPCO via API Convergence.

        `payload` doit respecter le schéma JSON défini par la norme
        Convergence (cf. spec OpenAPI cfadock.fr) — PAS le format du CRM ni
        les noms de champs du PDF CERFA. Une fonction de conversion
        `dossier -> payload Convergence` reste à écrire une fois ce schéma
        en main.
        """
        self._require_config()
        token = self._get_token()
        resp = requests.post(
            f'{self.base_url.rstrip("/")}/cerfa',
            json=payload,
            headers={
                'Authorization': f'Bearer {token}',
                'X-CFA-Key': self.cfa_key,
                'Content-Type': 'application/json',
            },
            timeout=self.timeout,
        )
        resp.raise_for_status()
        return resp.json()

    def get_status(self, dossier_reference: str) -> dict:
        """Consulte l'état d'un dossier transmis (endpoint à confirmer via la spec)."""
        self._require_config()
        token = self._get_token()
        resp = requests.get(
            f'{self.base_url.rstrip("/")}/cerfa/{dossier_reference}',
            headers={'Authorization': f'Bearer {token}', 'X-CFA-Key': self.cfa_key},
            timeout=self.timeout,
        )
        resp.raise_for_status()
        return resp.json()


def build_convergence_payload_from_dossier(context: dict, extra: dict | None = None) -> dict[str, Any]:
    """Squelette de conversion `contexte dossier CRM -> payload Convergence`.

    À COMPLÉTER avec le schéma exact de la norme (noms de champs JSON) une
    fois la spec OpenAPI récupérée sur cfadock.fr. Le contexte est le même
    que celui utilisé par `cerfa_service.CerfaService` (dossier / organisme /
    extra), pour réutiliser les mêmes données sans double saisie.
    """
    dossier = context.get('dossier', {})
    organisme = context.get('organisme', {})
    extra = extra or context.get('extra', {})
    return {
        'apprenti': {
            'nom': dossier.get('participant'),
        },
        'formation': {
            'intitule': dossier.get('titre_formation'),
        },
        'cfa': {
            'raison_sociale': organisme.get('nom'),
        },
        # 'employeur': extra.get('employeur', {}),
        # 'maitre_apprentissage': extra.get('maitre_apprentissage', {}),
        # 'contrat': extra.get('contrat', {}),
    }
