"""
CLI de test/débogage pour le remplissage de CERFA — ne nécessite PAS le CRM.

Exemples :
    python -m integration.crm.cerfa_cli champs cerfa_10103.pdf
    python -m integration.crm.cerfa_cli remplir cerfa_10103.pdf mapping.json contexte.json sortie.pdf
    python -m integration.crm.cerfa_cli remplir cerfa_10103.pdf mapping.json contexte.json sortie.pdf --flatten
"""
from __future__ import annotations

import argparse
import json
import sys

from .cerfa_service import build_values_from_mapping, fill_pdf, list_fields, load_mapping


def cmd_champs(args: argparse.Namespace) -> None:
    fields = list_fields(args.pdf)
    print(json.dumps(fields, ensure_ascii=False, indent=2))


def cmd_remplir(args: argparse.Namespace) -> None:
    mapping = load_mapping(args.mapping)
    mapping = {k: v for k, v in mapping.items() if not k.startswith('_')}
    with open(args.contexte, 'r', encoding='utf-8') as f:
        context = json.load(f)
    values = build_values_from_mapping(mapping, context)
    fill_pdf(args.pdf, args.sortie, values, flatten=args.flatten)
    print(f'PDF généré : {args.sortie}')


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description='Outils CERFA (introspection + remplissage PDF).')
    sub = parser.add_subparsers(dest='commande', required=True)

    p_champs = sub.add_parser('champs', help='Liste les champs AcroForm d\'un CERFA PDF')
    p_champs.add_argument('pdf')
    p_champs.set_defaults(func=cmd_champs)

    p_remplir = sub.add_parser('remplir', help='Remplit un CERFA PDF à partir d\'un mapping + contexte')
    p_remplir.add_argument('pdf')
    p_remplir.add_argument('mapping')
    p_remplir.add_argument('contexte')
    p_remplir.add_argument('sortie')
    p_remplir.add_argument('--flatten', action='store_true', help='Fige les champs (non modifiables)')
    p_remplir.set_defaults(func=cmd_remplir)

    args = parser.parse_args(argv)
    args.func(args)
    return 0


if __name__ == '__main__':
    sys.exit(main())
