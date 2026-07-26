"""
Mapping des données CRM DATA FORMA → champs CERFA / formulaires OPCOMMERCE.

Formulaires gérés :
  - PDC  (Plan de Développement des Compétences)       → CERFA 10103
  - AFPR (Action de Formation Préalable au Recrutement)
  - Pro-A (Reconversion ou Promotion par Alternance)
  - Apprentissage                                       → CERFA 10103 / FA
"""
from __future__ import annotations

from datetime import date, datetime
from typing import Any


class CerfaMapper:
    """
    Transforme un dossier CRM (dict) en payload structuré pour les
    formulaires CERFA du portail OPCOMMERCE.

    Exemple d'utilisation ::

        from integration.opcommerce import CerfaMapper

        dossier = {
            "participant":        "JEAN DUPONT",
            "titre_formation":    "NEGOCIATION ET DIGITALISATION DE LA RELATION CLIENT (BTS)",
            "date_debut":         "2026-09-01",
            "date_fin":           "2027-06-30",
            "nb_heures":          1200,
            "cout_pedagogique":   8500.00,
            "organisme_nom":      "DATA FORMA",
            "organisme_nda":      "11930811093",
            "organisme_siret":    "89233588100019",
            "employeur_raison_sociale": "SARL EXEMPLE",
            "employeur_siret":    "12345678901234",
            "employeur_adresse":  "10 rue de la Paix",
            "employeur_cp":       "75001",
            "employeur_ville":    "PARIS",
            "stagiaire_nom":      "DUPONT",
            "stagiaire_prenom":   "JEAN",
            "stagiaire_naissance":"1998-04-15",
        }

        mapper = CerfaMapper(type_cerfa="PDC")
        payload = mapper.map(dossier)
    """

    # Champs communs à tous les types de CERFA OPCOMMERCE
    _CHAMPS_COMMUNS = [
        "organisme_nom",
        "organisme_nda",
        "organisme_siret",
        "titre_formation",
        "date_debut",
        "date_fin",
        "nb_heures",
        "cout_pedagogique",
    ]

    # Types de CERFA supportés et leurs champs spécifiques
    TYPES_CERFA = {
        "PDC": {
            "label": "Plan de Développement des Compétences",
            "champs_specifiques": [
                "employeur_raison_sociale",
                "employeur_siret",
                "employeur_adresse",
                "employeur_cp",
                "employeur_ville",
                "stagiaire_nom",
                "stagiaire_prenom",
                "stagiaire_naissance",
                "stagiaire_emploi",
            ],
        },
        "PRO_A": {
            "label": "Reconversion ou Promotion par Alternance (Pro-A)",
            "champs_specifiques": [
                "employeur_raison_sociale",
                "employeur_siret",
                "stagiaire_nom",
                "stagiaire_prenom",
                "stagiaire_naissance",
                "stagiaire_contrat_type",
                "stagiaire_contrat_debut",
                "tuteur_nom",
                "tuteur_prenom",
                "tuteur_emploi",
            ],
        },
        "APPRENTISSAGE": {
            "label": "Contrat d'apprentissage",
            "champs_specifiques": [
                "employeur_raison_sociale",
                "employeur_siret",
                "employeur_idcc",
                "maitre_apprentissage_nom",
                "maitre_apprentissage_prenom",
                "apprenti_nom",
                "apprenti_prenom",
                "apprenti_naissance",
                "apprenti_nationalite",
                "diplome_prepare",
                "niveau_diplome",
            ],
        },
        "AFPR": {
            "label": "Action de Formation Préalable au Recrutement",
            "champs_specifiques": [
                "employeur_raison_sociale",
                "employeur_siret",
                "stagiaire_nom",
                "stagiaire_prenom",
                "stagiaire_naissance",
                "poste_vise",
            ],
        },
    }

    def __init__(self, type_cerfa: str = "PDC"):
        if type_cerfa not in self.TYPES_CERFA:
            raise ValueError(
                f"Type CERFA inconnu : {type_cerfa}. "
                f"Valeurs acceptées : {list(self.TYPES_CERFA.keys())}"
            )
        self.type_cerfa = type_cerfa

    # ------------------------------------------------------------------
    # API publique
    # ------------------------------------------------------------------

    def map(self, dossier: dict[str, Any]) -> dict[str, Any]:
        """
        Construit le payload CERFA normalisé depuis un dossier CRM.

        Le dossier peut provenir :
        - directement de la base CRM (tables dossiers + organismes + employeurs)
        - d'un export JSON manuel

        Retourne un dict prêt à être consommé par OpcommerceFiller.
        """
        payload: dict[str, Any] = {
            "type_cerfa": self.type_cerfa,
            "label_cerfa": self.TYPES_CERFA[self.type_cerfa]["label"],
        }

        # --- Organisme de formation ---
        payload["organisme_nom"] = self._get(
            dossier, "organisme_nom", "organisme", "org_nom"
        )
        payload["organisme_nda"] = self._get(dossier, "organisme_nda", "nda")
        payload["organisme_siret"] = self._get(
            dossier, "organisme_siret", "siret_organisme"
        )

        # --- Formation ---
        payload["titre_formation"] = self._get(
            dossier, "titre_formation", "intitule_formation", "intituleDocument"
        )
        payload["date_debut"] = self._fmt_date(
            self._get(dossier, "date_debut", "dateDebut", "date_debut_formation")
        )
        payload["date_fin"] = self._fmt_date(
            self._get(dossier, "date_fin", "dateFin", "date_fin_formation")
        )
        payload["nb_heures"] = self._get(
            dossier, "nb_heures", "duree_heures", "heures"
        )
        payload["cout_pedagogique"] = self._fmt_montant(
            self._get(dossier, "cout_pedagogique", "cout", "montant_ht")
        )

        # --- Employeur ---
        payload["employeur_raison_sociale"] = self._get(
            dossier,
            "employeur_raison_sociale",
            "employeur_nom",
            "raison_sociale",
            "entreprise",
        )
        payload["employeur_siret"] = self._get(
            dossier, "employeur_siret", "siret_employeur", "siret"
        )
        payload["employeur_adresse"] = self._get(
            dossier, "employeur_adresse", "adresse_employeur"
        )
        payload["employeur_cp"] = self._get(
            dossier, "employeur_cp", "code_postal_employeur", "cp"
        )
        payload["employeur_ville"] = self._get(
            dossier, "employeur_ville", "ville_employeur", "ville"
        )
        payload["employeur_idcc"] = self._get(
            dossier, "employeur_idcc", "idcc", "convention_collective"
        )
        payload["employeur_effectif"] = self._get(
            dossier, "employeur_effectif", "effectif"
        )

        # --- Stagiaire / Apprenti (nom complet ou séparé) ---
        participant_complet = self._get(
            dossier, "participant", "beneficiaire", "stagiaire"
        )
        payload["stagiaire_nom"] = self._get(
            dossier, "stagiaire_nom", "nom_stagiaire"
        ) or self._split_nom(participant_complet)
        payload["stagiaire_prenom"] = self._get(
            dossier, "stagiaire_prenom", "prenom_stagiaire"
        ) or self._split_prenom(participant_complet)
        payload["stagiaire_naissance"] = self._fmt_date(
            self._get(
                dossier, "stagiaire_naissance", "date_naissance", "naissance"
            )
        )
        payload["stagiaire_emploi"] = self._get(
            dossier, "stagiaire_emploi", "poste", "emploi_occupe"
        )
        payload["stagiaire_contrat_type"] = self._get(
            dossier, "stagiaire_contrat_type", "type_contrat"
        )
        payload["stagiaire_contrat_debut"] = self._fmt_date(
            self._get(dossier, "stagiaire_contrat_debut", "debut_contrat")
        )

        # Alias apprenti = stagiaire pour CERFA apprentissage
        if self.type_cerfa == "APPRENTISSAGE":
            payload["apprenti_nom"] = self._get(
                dossier, "apprenti_nom"
            ) or payload["stagiaire_nom"]
            payload["apprenti_prenom"] = self._get(
                dossier, "apprenti_prenom"
            ) or payload["stagiaire_prenom"]
            payload["apprenti_naissance"] = self._fmt_date(
                self._get(dossier, "apprenti_naissance")
            ) or payload["stagiaire_naissance"]
            payload["apprenti_nationalite"] = self._get(
                dossier, "apprenti_nationalite", "nationalite"
            )
            payload["maitre_apprentissage_nom"] = self._get(
                dossier, "maitre_apprentissage_nom", "maitre_nom"
            )
            payload["maitre_apprentissage_prenom"] = self._get(
                dossier, "maitre_apprentissage_prenom", "maitre_prenom"
            )
            payload["diplome_prepare"] = self._get(
                dossier, "diplome_prepare", "titre_formation"
            ) or payload["titre_formation"]
            payload["niveau_diplome"] = self._get(
                dossier, "niveau_diplome", "niveau"
            )

        # --- Tuteur / Maître (Pro-A) ---
        if self.type_cerfa == "PRO_A":
            payload["tuteur_nom"] = self._get(dossier, "tuteur_nom")
            payload["tuteur_prenom"] = self._get(dossier, "tuteur_prenom")
            payload["tuteur_emploi"] = self._get(dossier, "tuteur_emploi")

        # --- AFPR ---
        if self.type_cerfa == "AFPR":
            payload["poste_vise"] = self._get(dossier, "poste_vise", "poste")

        return payload

    def validate(self, payload: dict[str, Any]) -> list[str]:
        """
        Vérifie que les champs obligatoires sont présents.
        Retourne la liste des champs manquants (vide = OK).
        """
        requis = [
            "organisme_nom",
            "titre_formation",
            "date_debut",
            "date_fin",
            "employeur_raison_sociale",
            "employeur_siret",
            "stagiaire_nom",
            "stagiaire_prenom",
        ]
        if self.type_cerfa == "APPRENTISSAGE":
            requis += ["apprenti_naissance", "diplome_prepare"]

        return [c for c in requis if not payload.get(c)]

    # ------------------------------------------------------------------
    # Utilitaires privés
    # ------------------------------------------------------------------

    @staticmethod
    def _get(d: dict, *keys: str) -> Any:
        """Retourne la première clé trouvée dans le dict (ou None)."""
        for k in keys:
            v = d.get(k)
            if v is not None and v != "":
                return v
        return None

    @staticmethod
    def _fmt_date(value: Any) -> str | None:
        """Normalise en JJ/MM/AAAA (format CERFA français)."""
        if not value:
            return None
        if isinstance(value, (date, datetime)):
            return value.strftime("%d/%m/%Y")
        s = str(value).strip()
        # Déjà au bon format
        if len(s) == 10 and s[2] == "/" and s[5] == "/":
            return s
        # ISO 8601 → JJ/MM/AAAA
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d.%m.%Y"):
            try:
                return datetime.strptime(s, fmt).strftime("%d/%m/%Y")
            except ValueError:
                continue
        return s

    @staticmethod
    def _fmt_montant(value: Any) -> str | None:
        """Formate un montant en chaîne '1 234,56' (virgule décimale)."""
        if value is None:
            return None
        try:
            f = float(str(value).replace(",", ".").replace(" ", ""))
            return f"{f:,.2f}".replace(",", " ").replace(".", ",")
        except (ValueError, TypeError):
            return str(value)

    @staticmethod
    def _split_nom(participant: str | None) -> str | None:
        """Extrait le nom (dernier mot) d'un participant 'PRENOM NOM'."""
        if not participant:
            return None
        parts = participant.strip().split()
        return parts[-1] if parts else None

    @staticmethod
    def _split_prenom(participant: str | None) -> str | None:
        """Extrait le prénom (premier mot) d'un participant 'PRENOM NOM'."""
        if not participant:
            return None
        parts = participant.strip().split()
        return parts[0] if len(parts) > 1 else None
