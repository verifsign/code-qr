"""
Utilitaires de vérification QR — miroir Python de lib/verification.mjs
À intégrer dans le CRM Facturation V2 (Flask).
"""
from __future__ import annotations

import base64
import hashlib
import json
import secrets
from datetime import datetime
from typing import Any


def generate_envelope_id(length: int = 12) -> str:
    """Identifiant d'enveloppe (ex. A7B7434617A74)."""
    nbytes = (length + 1) // 2
    return secrets.token_hex(nbytes)[:length].upper()


def b64url_encode(text: str) -> str:
    raw = base64.b64encode(text.encode('utf-8')).decode('ascii')
    return raw.rstrip('=').replace('+', '-').replace('/', '_')


def b64url_decode(encoded: str) -> str:
    s = encoded.replace('-', '+').replace('_', '/')
    pad = (4 - len(s) % 4) % 4
    s += '=' * pad
    return base64.b64decode(s).decode('utf-8')


def encode_payload(obj: dict) -> str:
    return b64url_encode(json.dumps(obj, ensure_ascii=False, separators=(',', ':')))


def decode_payload(encoded: str) -> dict:
    return json.loads(b64url_decode(encoded))


def format_signe_le(dt: datetime | None = None) -> str:
    """Horodatage réel au format affiché (ex. 11/05/2026 à 15:02)."""
    dt = dt or datetime.now()
    return dt.strftime('%d/%m/%Y à %H:%M')


def sha256_file(path: str) -> str:
    """SHA-256 réel d'un fichier (PDF, etc.)."""
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()


def map_signataire(s: dict) -> dict:
    return {
        'n': s.get('nom') or s.get('n') or s.get('name') or '',
        'r': s.get('role') or s.get('r') or '',
        'd': s.get('signe_le') or s.get('signeLe') or s.get('d') or s.get('signedAt') or '',
        'e': s.get('email') or s.get('e') or None,
        'ip': s.get('ip') or None,
    }


def build_envelope_payload(crm: dict) -> dict:
    """Normalise un enregistrement CRM vers le format page de vérification."""
    sigs = crm.get('signataires') or crm.get('sigs') or []
    payload = {
        'id': crm.get('id') or crm.get('envelope_id') or crm.get('envelopeId'),
        'org': crm.get('organisme') or crm.get('org'),
        'doc': crm.get('intitule_document') or crm.get('doc') or crm.get('document'),
        'statut': crm.get('statut') or crm.get('status'),
        'beneficiaire': crm.get('beneficiaire') or crm.get('stagiaire') or crm.get('trainee'),
        'creeLe': crm.get('cree_le') or crm.get('creeLe') or crm.get('createdAt'),
        'sha': crm.get('hash_pdf') or crm.get('sha') or crm.get('sha256') or None,
        'sigs': [map_signataire(s) for s in sigs],
    }
    return {k: v for k, v in payload.items() if v is not None}


def build_verification_url(base_url: str, data: dict, mode: str = 'id') -> str:
    root = base_url.rstrip('/') + '/'
    if mode == 'hash':
        return root + '#d=' + encode_payload(data)
    eid = data.get('id')
    if not eid:
        raise ValueError('data.id requis pour le mode id')
    return root + '?id=' + eid


def build_legacy_hash_url(base_url: str, env: str, stag: str, org: str,
                          sigs: list, seal: str = '') -> str:
    """URL QR au format actuel du CRM (env/stag/seal dans le hash #d=)."""
    payload = {'env': env, 'stag': stag, 'org': org, 'sigs': sigs}
    if seal:
        payload['seal'] = seal
    root = base_url.rstrip('/') + '/'
    return root + '#d=' + encode_payload(payload)


def generate_qr_png(url: str, output_path: str, size: int = 512) -> None:
    """Génère un PNG QR code pointant vers l'URL de vérification."""
    import qrcode
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='#1E3A5F', back_color='#FFFFFF')
    img = img.resize((size, size))
    img.save(output_path)
