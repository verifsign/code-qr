"""
Blueprint Flask — génération de CERFA pré-remplis à partir des dossiers du CRM.
À brancher dans app.py du CRM Facturation V2 (même schéma que signature_blueprint.py).
"""
from __future__ import annotations

import os

from flask import Blueprint, jsonify, request, send_file

from .cerfa_service import CerfaService


def create_cerfa_blueprint(service: CerfaService) -> Blueprint:
    bp = Blueprint('cerfa', __name__)

    @bp.route('/api/cerfa/champs')
    def api_list_fields():
        template = request.args.get('template')
        if not template:
            return jsonify({'error': 'template requis (?template=cerfa_10103.pdf)'}), 400
        try:
            return jsonify(service.list_template_fields(template))
        except FileNotFoundError:
            return jsonify({'error': f"Modèle introuvable : {template}"}), 404

    @bp.route('/api/cerfa/dossier/<int:dossier_id>/generer', methods=['POST'])
    def api_generate(dossier_id):
        data = request.json or {}
        template = data.get('template')
        mapping = data.get('mapping')
        if not template or not mapping:
            return jsonify({'success': False, 'error': 'template et mapping requis'}), 400
        try:
            path = service.generate_for_dossier(
                dossier_id,
                template=template,
                mapping=mapping,
                extra=data.get('extra'),
                flatten=bool(data.get('flatten', False)),
            )
            return jsonify({'success': True, 'fichier': os.path.basename(path), 'chemin': path})
        except ValueError as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        except FileNotFoundError as e:
            return jsonify({'success': False, 'error': str(e)}), 404

    @bp.route('/api/cerfa/telecharger/<path:filename>')
    def api_download(filename):
        path = os.path.join(service.output_folder, os.path.basename(filename))
        if os.path.isfile(path):
            return send_file(path, mimetype='application/pdf', as_attachment=True)
        return jsonify({'error': 'Fichier introuvable'}), 404

    return bp


def register_cerfa_module(app, get_db, templates_dir: str, mappings_dir: str,
                          output_folder: str, row_to_context=None) -> CerfaService:
    """
    Point d'entrée unique — ajoute les routes CERFA au CRM.

    Exemple dans app.py :
        from integration.crm import register_cerfa_module
        cerfa_service = register_cerfa_module(
            app, get_db,
            templates_dir=os.path.join(BASE_DIR, 'cerfa_templates'),
            mappings_dir=os.path.join(BASE_DIR, 'integration', 'crm', 'cerfa', 'mappings'),
            output_folder=OUTPUT_FOLDER)
    """
    service = CerfaService(
        get_db=get_db,
        templates_dir=templates_dir,
        mappings_dir=mappings_dir,
        output_folder=output_folder,
        row_to_context=row_to_context,
    )
    app.register_blueprint(create_cerfa_blueprint(service))
    return service
