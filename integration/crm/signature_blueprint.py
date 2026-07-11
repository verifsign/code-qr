"""
Blueprint Flask — routes signature + vérification QR.
À brancher dans app.py du CRM Facturation V2.
"""
from __future__ import annotations

import os

from flask import Blueprint, jsonify, render_template_string, request, send_file

from .signature_service import SignatureService

VERIFY_PAGE_HTML = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vérification de document</title>
<style>
  :root{ --navy:#1E3A5F; --navy2:#183858; --ok:#2BA66F; --ink:#22303f; --muted:#5C7088; --line:#e4eaf0; --bg:#f4f7fb; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; padding:16px; }
  .card{ max-width:640px; margin:0 auto; background:#fff; border:1px solid var(--line); border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(30,58,95,.08); }
  .head{ background:linear-gradient(135deg,var(--navy),var(--navy2)); color:#fff; padding:22px 20px; }
  .head h1{ margin:0; font-size:19px; }
  .head p{ margin:6px 0 0; font-size:12.5px; opacity:.85; }
  .status{ display:inline-flex; align-items:center; gap:7px; margin-top:14px; background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.3); padding:6px 12px; border-radius:999px; font-size:12.5px; font-weight:600; }
  .dot{ width:9px; height:9px; border-radius:50%; background:var(--ok); }
  .body{ padding:18px 20px 22px; }
  .kv{ display:grid; grid-template-columns:130px 1fr; gap:4px 12px; font-size:13.5px; margin-bottom:4px; }
  .kv .k{ color:var(--muted); }
  .kv .v{ font-weight:600; word-break:break-word; }
  h2{ font-size:13px; text-transform:uppercase; letter-spacing:.6px; color:var(--navy); margin:22px 0 10px; padding-bottom:7px; border-bottom:2px solid var(--line); }
  .sig{ border:1px solid var(--line); border-radius:12px; padding:13px 14px; margin-bottom:10px; }
  .sig .name{ font-weight:700; font-size:15px; }
  .sig .role{ color:var(--muted); font-size:12.5px; }
  .chip{ background:rgba(43,166,111,.12); color:#1c7d52; border:1px solid rgba(43,166,111,.35); font-size:11.5px; font-weight:700; padding:4px 9px; border-radius:999px; }
  .mono{ font-family:ui-monospace,Menlo,Consolas,monospace; font-size:11px; color:var(--muted); word-break:break-all; }
  .foot{ margin-top:18px; padding-top:14px; border-top:1px solid var(--line); font-size:11.5px; color:var(--muted); line-height:1.55; }
  .err{ text-align:center; color:var(--muted); padding:26px 10px; }
  @media(max-width:420px){ .kv{ grid-template-columns:1fr; } }
</style>
</head>
<body><div class="card" id="card"><div class="err">Chargement…</div></div>
<script>
fetch('/api/signature/enveloppe/{{ envelope_id }}')
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(d => {
    const esc = x => String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
    const sigs = (d.sigs||[]).map(s =>
      '<div class="sig"><div class="name">'+esc(s.n)+'</div><div class="role">'+esc(s.r)+'</div>'
      +'<div>Signé le <b>'+esc(s.d)+'</b></div></div>').join('');
    document.getElementById('card').innerHTML =
      '<div class="head"><h1>Vérification de document</h1>'
      +'<div class="status"><span class="dot"></span> '+esc(d.statut)+'</div></div>'
      +'<div class="body"><div class="kv"><div class="k">Identifiant</div><div class="v">'+esc(d.id)+'</div></div>'
      +'<div class="kv"><div class="k">Bénéficiaire</div><div class="v">'+esc(d.beneficiaire)+'</div></div>'
      +'<div class="kv"><div class="k">Document</div><div class="v">'+esc(d.doc)+'</div></div>'
      +'<h2>Signataires</h2>'+sigs
      +(d.sha?'<h2>SHA-256</h2><div class="mono">'+esc(d.sha)+'</div>':'')
      +'<div class="foot">Informations enregistrées au moment de la signature.</div></div>';
    document.title = 'Vérification — ' + (d.id||'');
  })
  .catch(() => { document.getElementById('card').innerHTML = '<div class="err">Document introuvable.</div>'; });
</script></body></html>'''


def create_signature_blueprint(service: SignatureService) -> Blueprint:
    bp = Blueprint('signature', __name__)

    @bp.route('/verify')
    def verify_page():
        eid = request.args.get('id', '').strip()
        if not eid:
            return render_template_string(
                '<p style="font-family:sans-serif;text-align:center;margin-top:2rem">'
                'Scannez le QR code d\'un document.</p>'), 400
        return render_template_string(VERIFY_PAGE_HTML, envelope_id=eid)

    @bp.route('/api/signature/enveloppe/<envelope_id>')
    def api_get_envelope(envelope_id):
        try:
            return jsonify(service.get_payload(envelope_id))
        except ValueError as e:
            return jsonify({'error': str(e)}), 404

    @bp.route('/api/signature/enveloppes')
    def api_list_envelopes():
        statut = request.args.get('statut')
        return jsonify(service.list_all(statut=statut or None))

    @bp.route('/api/signature/enveloppe', methods=['POST'])
    def api_create_envelope():
        data = request.json or {}
        dossier_id = data.get('dossier_id')
        if not dossier_id:
            return jsonify({'success': False, 'error': 'dossier_id requis'}), 400
        try:
            result = service.create_for_dossier(
                int(dossier_id),
                intitule_document=data.get('intitule_document'),
                signataires_initiaux=data.get('signataires'),
            )
            if data.get('generate_qr'):
                qr = service.generate_qr(result['envelope_id'])
                result.update(qr)
            return jsonify({'success': True, **result})
        except ValueError as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    @bp.route('/api/signature/enveloppe/<envelope_id>/signer', methods=['POST'])
    def api_sign(envelope_id):
        data = request.json or {}
        nom = (data.get('nom') or '').strip()
        if not nom:
            return jsonify({'success': False, 'error': 'nom requis'}), 400
        try:
            result = service.record_signature(
                envelope_id,
                nom=nom,
                role=data.get('role', ''),
                email=data.get('email', ''),
                ip=request.remote_addr or data.get('ip', ''),
                signe_le=data.get('signe_le') or None,
            )
            return jsonify({'success': True, **result})
        except ValueError as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    @bp.route('/api/signature/enveloppe/<envelope_id>/sceller', methods=['POST'])
    def api_seal(envelope_id):
        data = request.json or {}
        try:
            result = service.seal_envelope(envelope_id, pdf_path=data.get('pdf_path'))
            if data.get('generate_qr', True):
                qr = service.generate_qr(envelope_id)
                result.update(qr)
            return jsonify({'success': True, **result})
        except ValueError as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    @bp.route('/api/signature/enveloppe/<envelope_id>/qr', methods=['POST'])
    def api_generate_qr(envelope_id):
        data = request.json or {}
        try:
            result = service.generate_qr(envelope_id, mode=data.get('mode', 'id'))
            return jsonify({'success': True, **result})
        except ValueError as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    @bp.route('/api/signature/dossier/<int:dossier_id>')
    def api_dossier_envelopes(dossier_id):
        return jsonify(service.list_by_dossier(dossier_id))

    @bp.route('/api/signature/qr/<path:filename>')
    def api_serve_qr(filename):
        path = os.path.join(service.output_folder, os.path.basename(filename))
        if os.path.isfile(path):
            return send_file(path, mimetype='image/png')
        return 'QR introuvable', 404

    return bp


def register_signature_module(app, get_db, output_folder: str,
                            verif_base_url: str | None = None,
                            format_date_fr=None,
                            code_qr_data_dir: str | None = None):
    """
    Point d'entrée unique — ajoute routes + tables au CRM.

    Exemple dans app.py :
        from integration.crm import register_signature_module
        register_signature_module(app, get_db, OUTPUT_FOLDER,
            verif_base_url='https://verifsign.github.io/code-qr/',
            format_date_fr=format_date_fr,
            code_qr_data_dir=os.path.join(BASE_DIR, '..', 'code-qr', 'data', 'envelopes'))
    """
    base = verif_base_url or os.environ.get(
        'VERIF_BASE_URL', 'https://verifsign.github.io/code-qr/')
    service = SignatureService(
        get_db=get_db,
        output_folder=output_folder,
        verif_base_url=base,
        format_date_fr=format_date_fr,
        code_qr_data_dir=code_qr_data_dir,
    )
    service.ensure_tables()
    app.register_blueprint(create_signature_blueprint(service))
    return service
