"""Génération automatique du CERFA 10103*14 (contrat d'apprentissage)
pré-rempli, prêt à déposer sur le portail de l'Opcommerce."""

from .fill_cerfa import remplir_cerfa, construire_valeurs, telecharger_modele

__all__ = ["remplir_cerfa", "construire_valeurs", "telecharger_modele"]
