#!/usr/bin/env python3
"""Génère un CERFA 10103*14 (contrat d'apprentissage) pré-rempli.

Usage en ligne de commande :

    python -m integration.cerfa.fill_cerfa --dossier dossier.json --sortie cerfa-rempli.pdf

Usage en Python (par exemple depuis le CRM Flask) :

    from integration.cerfa import remplir_cerfa
    remplir_cerfa(dossier_dict, sortie="output/cerfa-DUPONT.pdf")

Le schéma du dossier JSON est documenté dans exemple-dossier.json et README.md.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

try:
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import NameObject, BooleanObject
except ImportError:  # pragma: no cover
    sys.exit("pypdf est requis : pip install pypdf")

if __package__:
    from . import mapping_10103_14 as M
else:  # exécution directe : python fill_cerfa.py
    import mapping_10103_14 as M

MODELE_PAR_DEFAUT = Path(__file__).parent / "modeles" / "cerfa_10103-14.pdf"
URL_MODELE_OFFICIEL = "https://www.formulaires.service-public.gouv.fr/gf/cerfa_10103.do"


# ---------------------------------------------------------------------------
# Accès aux données du dossier
# ---------------------------------------------------------------------------
def _valeur(dossier: dict, chemin: str):
    """Retourne la valeur au chemin pointé ("employeur.adresse.voie",
    "maitresApprentissage.0.prenom"), ou None si absente."""
    courant = dossier
    for partie in chemin.split("."):
        if isinstance(courant, list):
            idx = int(partie)
            if idx >= len(courant):
                return None
            courant = courant[idx]
        elif isinstance(courant, dict):
            courant = courant.get(partie)
        else:
            return None
        if courant is None:
            return None
    return courant


def _date_jma(valeur) -> tuple[str, str, str] | None:
    """Découpe une date "AAAA-MM-JJ" ou "JJ/MM/AAAA" en (jour, mois, année)."""
    if not valeur:
        return None
    texte = str(valeur).strip()
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", texte)
    if m:
        return m.group(3), m.group(2), m.group(1)
    m = re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{4})", texte)
    if m:
        return m.group(1).zfill(2), m.group(2).zfill(2), m.group(3)
    raise ValueError(f"Format de date non reconnu : {texte!r} (attendu AAAA-MM-JJ ou JJ/MM/AAAA)")


def _montant_euros_centimes(valeur) -> tuple[str, str] | None:
    """Découpe un montant (774.77, "774,77" ou "774") en (euros, centimes)."""
    if valeur is None or valeur == "":
        return None
    texte = str(valeur).strip().replace(",", ".")
    if "." in texte:
        euros, centimes = texte.split(".", 1)
        return euros, centimes[:2].ljust(2, "0")
    return texte, "00"


# ---------------------------------------------------------------------------
# Construction du dictionnaire {nom de champ PDF: valeur}
# ---------------------------------------------------------------------------
def construire_valeurs(dossier: dict) -> dict:
    valeurs: dict[str, str] = {}

    for chemin, champ in M.CHAMPS_TEXTE.items():
        v = _valeur(dossier, chemin)
        if v is not None and str(v) != "":
            valeurs[champ] = str(v)

    for chemin, (f_j, f_m, f_a) in M.CHAMPS_DATE.items():
        jma = _date_jma(_valeur(dossier, chemin))
        if jma:
            valeurs[f_j], valeurs[f_m], valeurs[f_a] = jma

    for chemin, (f_euros, f_centimes) in M.CHAMPS_MONTANT.items():
        ec = _montant_euros_centimes(_valeur(dossier, chemin))
        if ec:
            valeurs[f_euros], valeurs[f_centimes] = ec

    for chemin, (case_oui, case_non) in M.CHAMPS_OUI_NON.items():
        v = _valeur(dossier, chemin)
        if v is True:
            valeurs[case_oui] = "/Yes"
        elif v is False:
            valeurs[case_non] = "/Yes"

    for chemin, case in M.CHAMPS_CASE.items():
        if _valeur(dossier, chemin) is True:
            valeurs[case] = "/Yes"

    type_employeur = (_valeur(dossier, "employeur.type") or "").lower()
    if type_employeur.startswith("priv"):
        valeurs[M.CASE_EMPLOYEUR_PRIVE] = "/Yes"
    elif type_employeur.startswith("pub"):
        valeurs[M.CASE_EMPLOYEUR_PUBLIC] = "/Yes"

    sexe = (_valeur(dossier, "apprenti.sexe") or "").upper()
    if sexe == "M":
        valeurs[M.CASE_SEXE_M] = "/Yes"
    elif sexe == "F":
        valeurs[M.CASE_SEXE_F] = "/Yes"

    # Rémunération : liste d'objets {annee, periode1: {...}, periode2: {...}}
    for ligne in _valeur(dossier, "contrat.remuneration") or []:
        annee = int(ligne.get("annee", 0))
        for num_periode in (1, 2):
            periode = ligne.get(f"periode{num_periode}")
            if not periode:
                continue
            cle = (annee, num_periode)
            if cle not in M.REMUNERATION:
                raise ValueError(f"Rémunération : année {annee} hors du CERFA (1 à 4)")
            f = M.REMUNERATION[cle]
            du = _date_jma(periode.get("du"))
            au = _date_jma(periode.get("au"))
            if du:
                valeurs[f[0]], valeurs[f[1]], valeurs[f[2]] = du
            if au:
                valeurs[f[3]], valeurs[f[4]], valeurs[f[5]] = au
            if periode.get("pourcentage") not in (None, ""):
                valeurs[f[6]] = str(periode["pourcentage"])
            if periode.get("reference"):
                valeurs[f[7]] = str(periode["reference"])

    return valeurs


# ---------------------------------------------------------------------------
# Remplissage du PDF
# ---------------------------------------------------------------------------
def remplir_cerfa(dossier: dict, sortie, modele=None) -> Path:
    """Remplit le CERFA 10103*14 et écrit le PDF résultant.

    dossier : dictionnaire au format documenté (voir exemple-dossier.json)
    sortie  : chemin du PDF généré
    modele  : chemin du CERFA vierge (par défaut : modeles/cerfa_10103-14.pdf)
    """
    modele = Path(modele) if modele else MODELE_PAR_DEFAUT
    if not modele.exists():
        raise FileNotFoundError(
            f"Modèle CERFA introuvable : {modele}\n"
            f"Téléchargez-le avec : python -m integration.cerfa.fill_cerfa --telecharger-modele")

    valeurs = construire_valeurs(dossier)

    lecteur = PdfReader(str(modele))
    ecrivain = PdfWriter()
    ecrivain.append(lecteur)

    # NeedAppearances force les lecteurs PDF à régénérer l'affichage des champs
    ecrivain._root_object["/AcroForm"][NameObject("/NeedAppearances")] = BooleanObject(True)

    noms_connus = set(lecteur.get_fields() or {})
    inconnus = [n for n in valeurs if n not in noms_connus]
    if inconnus:
        raise ValueError(
            "Champs absents du PDF (le modèle a peut-être changé de version) : "
            + ", ".join(inconnus))

    for page in ecrivain.pages:
        ecrivain.update_page_form_field_values(page, valeurs, auto_regenerate=False)

    sortie = Path(sortie)
    sortie.parent.mkdir(parents=True, exist_ok=True)
    with open(sortie, "wb") as f:
        ecrivain.write(f)
    return sortie


def telecharger_modele(destination=None) -> Path:
    """Télécharge le CERFA vierge officiel depuis service-public.gouv.fr."""
    destination = Path(destination) if destination else MODELE_PAR_DEFAUT
    destination.parent.mkdir(parents=True, exist_ok=True)
    requete = urllib.request.Request(URL_MODELE_OFFICIEL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(requete, timeout=60) as reponse:
        contenu = reponse.read()
    if not contenu.startswith(b"%PDF"):
        raise RuntimeError("La réponse du serveur n'est pas un PDF")
    destination.write_bytes(contenu)
    return destination


def lister_champs(modele=None):
    """Liste les champs du PDF (utile pour vérifier une nouvelle version du CERFA)."""
    modele = Path(modele) if modele else MODELE_PAR_DEFAUT
    lecteur = PdfReader(str(modele))
    for nom, champ in (lecteur.get_fields() or {}).items():
        print(f"{nom!r}\t{champ.get('/FT')}")


# ---------------------------------------------------------------------------
# Ligne de commande
# ---------------------------------------------------------------------------
def main(argv=None):
    parseur = argparse.ArgumentParser(
        description="Remplit automatiquement le CERFA 10103*14 (contrat d'apprentissage) "
                    "à partir d'un dossier JSON, prêt à déposer sur le portail de l'Opcommerce.")
    parseur.add_argument("--dossier", help="chemin du dossier JSON")
    parseur.add_argument("--sortie", default="output/cerfa-rempli.pdf",
                         help="chemin du PDF généré (défaut : output/cerfa-rempli.pdf)")
    parseur.add_argument("--modele", help="chemin du CERFA vierge (défaut : modèle embarqué)")
    parseur.add_argument("--telecharger-modele", action="store_true",
                         help="télécharge le CERFA vierge officiel puis quitte")
    parseur.add_argument("--lister-champs", action="store_true",
                         help="liste les champs du PDF puis quitte")
    args = parseur.parse_args(argv)

    if args.telecharger_modele:
        chemin = telecharger_modele(args.modele)
        print(f"Modèle téléchargé : {chemin}")
        return

    if args.lister_champs:
        lister_champs(args.modele)
        return

    if not args.dossier:
        parseur.error("--dossier est requis (ou utilisez --telecharger-modele / --lister-champs)")

    with open(args.dossier, encoding="utf-8") as f:
        dossier = json.load(f)

    sortie = remplir_cerfa(dossier, args.sortie, args.modele)
    print(f"CERFA généré : {sortie}")


if __name__ == "__main__":
    main()
