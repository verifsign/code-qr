"""Intégration QR / signatures pour le CRM Facturation V2."""
from .signature_service import SignatureService
from .qr_verification import (
    build_envelope_payload,
    build_verification_url,
    format_signe_le,
    generate_envelope_id,
    sha256_file,
)


def register_signature_module(*args, **kwargs):
    from .signature_blueprint import register_signature_module as _register_signature_module
    return _register_signature_module(*args, **kwargs)


__all__ = [
    'register_signature_module',
    'SignatureService',
    'build_envelope_payload',
    'build_verification_url',
    'format_signe_le',
    'generate_envelope_id',
    'sha256_file',
]
