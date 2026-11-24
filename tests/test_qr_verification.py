import unittest
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / 'integration' / 'crm' / 'qr_verification.py'
SPEC = spec_from_file_location('qr_verification', MODULE_PATH)
qr_verification = module_from_spec(SPEC)
SPEC.loader.exec_module(qr_verification)

build_envelope_payload = qr_verification.build_envelope_payload
build_legacy_hash_url = qr_verification.build_legacy_hash_url
build_verification_url = qr_verification.build_verification_url
decode_payload = qr_verification.decode_payload
encode_payload = qr_verification.encode_payload


class QrVerificationTests(unittest.TestCase):
    def test_encode_decode_payload_preserves_unicode(self):
        payload = {
            'id': 'A7B7434617A74',
            'org': 'DATA FORMA',
            'beneficiaire': 'Baptiste Bléteau',
            'sigs': [{'n': 'Zoë Martin', 'r': 'Gérant', 'd': '11/05/2026 à 15:02'}],
        }

        encoded = encode_payload(payload)

        self.assertRegex(encoded, r'^[A-Za-z0-9_-]+$')
        self.assertEqual(decode_payload(encoded), payload)

    def test_build_verification_url_uses_stable_trailing_slash(self):
        self.assertEqual(
            build_verification_url('https://verifsign.github.io/code-qr', {'id': 'ENV-123'}),
            'https://verifsign.github.io/code-qr/?id=ENV-123',
        )

    def test_build_legacy_hash_url_embeds_current_crm_fields(self):
        url = build_legacy_hash_url(
            'https://verifsign.github.io/code-qr/',
            'ENV-123',
            'Baptiste Bleteau',
            'DATA FORMA',
            [{'n': 'Marie Dupont', 'r': 'Responsable', 'd': '11/05/2026 à 15:02'}],
            '12/05/2026 à 09:30',
        )

        self.assertTrue(url.startswith('https://verifsign.github.io/code-qr/#d='))
        self.assertEqual(
            decode_payload(url.split('#d=', 1)[1]),
            {
                'env': 'ENV-123',
                'stag': 'Baptiste Bleteau',
                'org': 'DATA FORMA',
                'sigs': [{'n': 'Marie Dupont', 'r': 'Responsable', 'd': '11/05/2026 à 15:02'}],
                'seal': '12/05/2026 à 09:30',
            },
        )

    def test_build_envelope_payload_maps_crm_aliases_and_omits_empty_hash(self):
        payload = build_envelope_payload({
            'envelope_id': 'ENV-123',
            'organisme': 'DATA FORMA',
            'intitule_document': 'Attestation de formation',
            'status': 'Terminé',
            'stagiaire': 'Baptiste Bleteau',
            'cree_le': '2026-05-11',
            'hash_pdf': None,
            'signataires': [{
                'nom': 'Marie Dupont',
                'role': 'Gérante',
                'signe_le': '11/05/2026 à 15:02',
                'email': 'marie@example.test',
                'ip': '127.0.0.1',
            }],
        })

        self.assertEqual(payload, {
            'id': 'ENV-123',
            'org': 'DATA FORMA',
            'doc': 'Attestation de formation',
            'statut': 'Terminé',
            'beneficiaire': 'Baptiste Bleteau',
            'creeLe': '2026-05-11',
            'sigs': [{
                'n': 'Marie Dupont',
                'r': 'Gérante',
                'd': '11/05/2026 à 15:02',
                'e': 'marie@example.test',
                'ip': '127.0.0.1',
            }],
        })


if __name__ == '__main__':
    unittest.main()
