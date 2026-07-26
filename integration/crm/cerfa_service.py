"""
Remplissage automatique de formulaires CERFA (PDF AcroForm) — ex. Cerfa 10103
« Contrat d'apprentissage », transmis ensuite à l'OPCO (Opcommerce, etc.).

Ce module ne connaît PAS à l'avance les noms des champs internes de votre
CERFA (ils varient selon le PDF exact fourni par le service-public). Utilisez
`list_fields()` sur votre propre fichier pour les découvrir, puis construisez
un mapping JSON (voir `integration/crm/cerfa/mappings/`) qui associe :

    "nom_du_champ_pdf" -> "{{dossier.participant}}"  (gabarit résolu depuis le CRM)
    "nom_du_champ_pdf" -> "valeur fixe"               (valeur littérale)

Deux façons d'aller plus loin une fois ce module en place :
1. Générer le PDF pré-rempli puis le transmettre manuellement sur le portail
   Web Services Partenaire de l'OPCO (ex. https://www.lopcommerce.com/).
2. Brancher `convergence_client.py` (API Convergence CFA/OPCO) pour transmettre
   les données directement, sans PDF, une fois votre clé CFA_KEY obtenue.
"""
from __future__ import annotations

import json
import os
import re
from typing import Any, Callable

from pypdf import PdfReader, PdfWriter

_PLACEHOLDER_RE = re.compile(r'\{\{\s*([\w\.]+)\s*\}\}')


def _lookup_path(context: dict, path: str) -> Any:
    node: Any = context
    for part in path.split('.'):
        if isinstance(node, dict):
            node = node.get(part)
        else:
            node = getattr(node, part, None)
        if node is None:
            return None
    return node


def resolve_template(value: Any, context: dict) -> Any:
    """Résout les gabarits `{{a.b.c}}` d'une valeur de mapping à partir du contexte.

    - `"{{dossier.participant}}"` (gabarit seul) -> valeur brute (str, bool, int...).
    - `"Bonjour {{dossier.participant}} !"` -> interpolation texte.
    - Toute valeur sans `{{ }}` est renvoyée telle quelle (valeur littérale).
    """
    if not isinstance(value, str):
        return value
    matches = _PLACEHOLDER_RE.findall(value)
    if not matches:
        return value
    if len(matches) == 1 and value.strip() == '{{%s}}' % matches[0]:
        return _lookup_path(context, matches[0])

    def _sub(m: re.Match) -> str:
        resolved = _lookup_path(context, m.group(1))
        return '' if resolved is None else str(resolved)

    return _PLACEHOLDER_RE.sub(_sub, value)


def build_values_from_mapping(mapping: dict, context: dict) -> dict:
    """Applique un mapping de champs CERFA à un contexte (dossier CRM, etc.)."""
    values: dict[str, Any] = {}
    for field_name, template in mapping.items():
        resolved = resolve_template(template, context)
        if resolved is None:
            continue
        values[field_name] = resolved
    return values


def list_fields(template_path: str) -> dict:
    """Introspecte les champs AcroForm d'un CERFA PDF (nom, type, valeur actuelle).

    Utile pour construire un mapping : lancez cette fonction sur votre PDF
    officiel (téléchargé depuis service-public.fr ou fourni par l'OPCO) afin
    d'obtenir les vrais noms de champs à utiliser dans `mapping.json`.
    """
    reader = PdfReader(template_path)
    raw_fields = reader.get_fields() or {}
    out: dict[str, dict] = {}
    for name, f in raw_fields.items():
        out[name] = {
            'type': str(f.get('/FT')) if f.get('/FT') is not None else None,
            'value': f.get('/V'),
            'options': [str(o) for o in f['/Opt']] if f.get('/Opt') else None,
        }
    return out


def fill_pdf(template_path: str, output_path: str, values: dict,
             flatten: bool = False) -> str:
    """Remplit un CERFA PDF avec `values` (nom_champ -> valeur) et écrit `output_path`.

    `flatten=True` transforme les champs en texte figé (non modifiable) — à
    réserver au document final, une fois vérifié.
    """
    reader = PdfReader(template_path)
    writer = PdfWriter()
    writer.append(reader)

    text_values = {k: v for k, v in values.items() if not isinstance(v, bool)}
    checkbox_values = {k: ('/Yes' if v else '/Off') for k, v in values.items() if isinstance(v, bool)}
    all_values = {**text_values, **checkbox_values}

    for page in writer.pages:
        writer.update_page_form_field_values(
            page, all_values, auto_regenerate=False, flatten=flatten)

    # Force les lecteurs PDF (Adobe, navigateurs) à régénérer l'affichage des
    # champs plutôt que d'afficher l'ancienne apparence vide.
    writer.set_need_appearances_writer(not flatten)

    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    with open(output_path, 'wb') as fh:
        writer.write(fh)
    return output_path


def load_mapping(mapping_path: str) -> dict:
    with open(mapping_path, 'r', encoding='utf-8') as f:
        return json.load(f)


class CerfaService:
    """Service haut niveau — relie un `dossier` du CRM à un CERFA pré-rempli.

    Exemple :
        svc = CerfaService(get_db=get_db, templates_dir='cerfa_templates',
                           mappings_dir='integration/crm/cerfa/mappings',
                           output_folder=OUTPUT_FOLDER)
        pdf_path = svc.generate_for_dossier(
            dossier_id=42,
            template='cerfa_10103.pdf',
            mapping='exemple_cerfa_apprentissage.json',
            extra={'employeur': {'siret': '...'}, 'maitre_apprentissage': {...}},
        )
    """

    def __init__(self, get_db: Callable, templates_dir: str, mappings_dir: str,
                 output_folder: str, row_to_context: Callable | None = None):
        self.get_db = get_db
        self.templates_dir = templates_dir
        self.mappings_dir = mappings_dir
        self.output_folder = output_folder
        self.row_to_context = row_to_context or self._default_row_to_context

    @staticmethod
    def _default_row_to_context(row) -> dict:
        """Convertit une ligne `dossiers` (+ `organismes`) du CRM en contexte de mapping.

        Adaptez cette fonction (ou passez `row_to_context` au constructeur) au
        schéma réel de votre CRM si les noms de colonnes diffèrent.
        """
        d = dict(row)
        return {
            'dossier': d,
            'organisme': {
                'nom': d.get('org_nom'),
                'gerant': d.get('gerant'),
            },
        }

    def _dossier_context(self, dossier_id: int) -> dict:
        conn = self.get_db()
        try:
            row = conn.execute('''
                SELECT d.*, o.nom AS org_nom, o.gerant
                FROM dossiers d
                JOIN organismes o ON d.organisme_id = o.id
                WHERE d.id = ?
            ''', (dossier_id,)).fetchone()
            if not row:
                raise ValueError('Dossier introuvable')
            return self.row_to_context(row)
        finally:
            conn.close()

    def list_template_fields(self, template: str) -> dict:
        return list_fields(os.path.join(self.templates_dir, template))

    def generate_for_dossier(self, dossier_id: int, template: str, mapping: str,
                             extra: dict | None = None, flatten: bool = False) -> str:
        context = self._dossier_context(dossier_id)
        if extra:
            context.update(extra)

        mapping_dict = load_mapping(os.path.join(self.mappings_dir, mapping))
        values = build_values_from_mapping(mapping_dict, context)

        template_path = os.path.join(self.templates_dir, template)
        os.makedirs(self.output_folder, exist_ok=True)
        output_name = f'cerfa-dossier-{dossier_id}.pdf'
        output_path = os.path.join(self.output_folder, output_name)
        fill_pdf(template_path, output_path, values, flatten=flatten)
        return output_path
