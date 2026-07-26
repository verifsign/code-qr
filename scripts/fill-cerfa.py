#!/usr/bin/env python3
"""
Script CLI — Remplissage automatique CERFA sur le portail OPCOMMERCE.

Usage
-----
    python scripts/fill-cerfa.py --file dossier.json [options]
    python scripts/fill-cerfa.py --dossier-id 42    [options]

Options
-------
    --file FILE           Chemin vers un fichier JSON de dossier stagiaire
    --dossier-id ID       ID du dossier dans la base CRM (nécessite --crm-db)
    --crm-db PATH         Chemin vers la base SQLite du CRM (défaut : crm.db)
    --type-cerfa TYPE     PDC | PRO_A | APPRENTISSAGE | AFPR  (défaut : PDC)
    --dry-run             Remplit le formulaire sans soumettre
    --visible             Lance le navigateur en mode visible (débogage)
    --screenshots DIR     Dossier où sauvegarder les captures d'écran
    --login EMAIL         Email OPCOMMERCE (ou env OPCOMMERCE_LOGIN)
    --password PWD        Mot de passe (ou env OPCOMMERCE_PASSWORD)
    --help                Affiche cette aide

Variables d'environnement
-------------------------
    OPCOMMERCE_LOGIN      Email du compte OPCOMMERCE
    OPCOMMERCE_PASSWORD   Mot de passe du compte OPCOMMERCE

Exemples
--------
    # Depuis un fichier JSON avec compte en variables d'environnement
    export OPCOMMERCE_LOGIN=mon.email@entreprise.fr
    export OPCOMMERCE_PASSWORD=motdepasse
    python scripts/fill-cerfa.py --file integration/opcommerce/examples/dossier-pdc.json

    # Depuis la base CRM, en visible pour débogage
    python scripts/fill-cerfa.py --dossier-id 42 --crm-db crm.db --visible

    # Dry-run avec captures d'écran
    python scripts/fill-cerfa.py --file dossier.json --dry-run --screenshots /tmp/cerfa_debug
"""
import argparse
import json
import os
import sys

# Ajouter le dossier racine au path pour les imports relatifs
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, WORKSPACE_DIR)


def load_dossier_from_file(path: str) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_dossier_from_crm(dossier_id: int, crm_db: str) -> dict:
    """Charge un dossier depuis la base SQLite du CRM."""
    import sqlite3

    if not os.path.isfile(crm_db):
        raise FileNotFoundError(f"Base CRM introuvable : {crm_db}")

    conn = sqlite3.connect(crm_db)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    try:
        row = c.execute("""
            SELECT d.*,
                   o.nom         AS organisme_nom,
                   o.nda         AS organisme_nda,
                   o.siret       AS organisme_siret,
                   e.raison_sociale AS employeur_raison_sociale,
                   e.siret       AS employeur_siret,
                   e.adresse     AS employeur_adresse,
                   e.code_postal AS employeur_cp,
                   e.ville       AS employeur_ville,
                   e.idcc        AS employeur_idcc,
                   e.effectif    AS employeur_effectif
            FROM dossiers d
            LEFT JOIN organismes    o ON d.organisme_id  = o.id
            LEFT JOIN employeurs    e ON d.employeur_id  = e.id
            WHERE d.id = ?
        """, (dossier_id,)).fetchone()

        if not row:
            raise ValueError(f"Dossier {dossier_id} introuvable dans {crm_db}")

        dossier = dict(row)

        # Décomposition nom/prénom si champ "participant" uniquement
        participant = dossier.get("participant", "")
        if participant and not dossier.get("stagiaire_nom"):
            parts = participant.strip().split()
            dossier["stagiaire_prenom"] = parts[0] if parts else ""
            dossier["stagiaire_nom"]    = parts[-1] if len(parts) > 1 else ""

        return dossier
    finally:
        conn.close()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Remplissage automatique CERFA sur le portail OPCOMMERCE",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--file",       metavar="FILE",  help="Fichier JSON dossier stagiaire")
    source.add_argument("--dossier-id", metavar="ID",    type=int, help="ID dossier CRM")

    parser.add_argument("--crm-db",      metavar="PATH",  default="crm.db",
                        help="Base SQLite CRM (défaut : crm.db)")
    parser.add_argument("--type-cerfa",  metavar="TYPE",  default="PDC",
                        choices=["PDC", "PRO_A", "APPRENTISSAGE", "AFPR"],
                        help="Type de formulaire CERFA (défaut : PDC)")
    parser.add_argument("--dry-run",     action="store_true",
                        help="Remplit sans soumettre")
    parser.add_argument("--visible",     action="store_true",
                        help="Navigateur visible (débogage)")
    parser.add_argument("--screenshots", metavar="DIR",   default=None,
                        help="Dossier captures d'écran")
    parser.add_argument("--login",       metavar="EMAIL", default=None,
                        help="Email OPCOMMERCE")
    parser.add_argument("--password",    metavar="PWD",   default=None,
                        help="Mot de passe OPCOMMERCE")

    args = parser.parse_args()

    # ---- Chargement du dossier ----
    if args.file:
        print(f"[cerfa] Chargement depuis {args.file}")
        dossier = load_dossier_from_file(args.file)
    else:
        print(f"[cerfa] Chargement dossier #{args.dossier_id} depuis {args.crm_db}")
        dossier = load_dossier_from_crm(args.dossier_id, args.crm_db)

    # Forcer le type CERFA si demandé en CLI
    dossier.setdefault("type_cerfa", args.type_cerfa)
    if args.type_cerfa:
        dossier["type_cerfa"] = args.type_cerfa

    # ---- Mapping CRM → CERFA ----
    from integration.opcommerce import CerfaMapper

    mapper  = CerfaMapper(type_cerfa=dossier["type_cerfa"])
    payload = mapper.map(dossier)

    manquants = mapper.validate(payload)
    if manquants:
        print(f"[cerfa] ⚠  Champs manquants : {', '.join(manquants)}", file=sys.stderr)
        print("[cerfa] Continuez avec --dry-run pour tester quand même.", file=sys.stderr)
        if not args.dry_run:
            return 1

    print(f"[cerfa] Payload CERFA ({dossier['type_cerfa']}) :")
    for k, v in payload.items():
        if v:
            print(f"         {k:35s} = {v}")

    # ---- Remplissage OPCOMMERCE ----
    from integration.opcommerce import OpcommerceFiller

    filler = OpcommerceFiller(
        login=args.login,
        password=args.password,
        headless=not args.visible,
        screenshot_dir=args.screenshots,
        dry_run=args.dry_run,
    )

    print(f"\n[cerfa] {'[DRY-RUN] ' if args.dry_run else ''}Ouverture du portail OPCOMMERCE…")
    result = filler.fill(payload)

    if result["success"]:
        if result["reference"]:
            print(f"[cerfa] ✔  Demande soumise — référence OPCOMMERCE : {result['reference']}")
        else:
            print("[cerfa] ✔  Formulaire rempli avec succès")
        if result["screenshot"]:
            print(f"[cerfa]    Capture finale : {result['screenshot']}")
        return 0
    else:
        print(f"[cerfa] ✗  Erreur : {result['erreur']}", file=sys.stderr)
        if result["screenshot"]:
            print(f"[cerfa]    Capture erreur : {result['screenshot']}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
