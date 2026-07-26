"""Intégration QR / signatures / CERFA pour le CRM Facturation V2."""
from .signature_blueprint import register_signature_module
from .signature_service import SignatureService
from .qr_verification import (
    build_envelope_payload,
    build_verification_url,
    format_signe_le,
    generate_envelope_id,
    sha256_file,
)
from .cerfa_blueprint import register_cerfa_module
from .cerfa_service import CerfaService, build_values_from_mapping, fill_pdf, list_fields
from .convergence_client import ConvergenceClient, build_convergence_payload_from_dossier

__all__ = [
    'register_signature_module',
    'SignatureService',
    'build_envelope_payload',
    'build_verification_url',
    'format_signe_le',
    'generate_envelope_id',
    'sha256_file',
    'register_cerfa_module',
    'CerfaService',
    'build_values_from_mapping',
    'fill_pdf',
    'list_fields',
    'ConvergenceClient',
    'build_convergence_payload_from_dossier',
]
