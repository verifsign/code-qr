import importlib.util
from pathlib import Path
import unittest

MODULE_PATH = Path(__file__).resolve().parents[1] / 'integration' / 'crm' / 'qr_verification.py'
SPEC = importlib.util.spec_from_file_location('qr_verification', MODULE_PATH)
qr_verification = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(qr_verification)

build_envelope_payload = qr_verification.build_envelope_payload
build_legacy_hash_url = qr_verification.build_legacy_hash_url
build_verification_url = qr_verification.build_verification_url
decode_payload = qr_verification.decode_payload
encode_payload = qr_verification.encode_payload
map_signataire = qr_verification.map_signataire


class QRVerificationTest(unittest.TestCase):
    def test_payload_round_trip_preserves_utf8_and_uses_url_safe_base64(self):
        payload = {
            'id': 'ENV-42',
            'beneficiaire': 'B\u00e9n\u00e9ficiaire valid\u00e9',
            'sigs': [{'n': 'Alice', 'r': 'G\u00e9rant', 'd': '11/05/2026 \u00e0 15:02'}],
        }

        encoded = encode_payload(payload)

        self.assertNotRegex(encoded, r'[+/=]')
        self.assertEqual(decode_payload(encoded), payload)

    def test_legacy_hash_url_keeps_current_crm_contract(self):
        sigs = [{'n': 'SITBON RICHARD', 'r': 'G\u00e9rant', 'd': '11/05/2026 \u00e0 15:02'}]

        url = build_legacy_hash_url(
            'https://example.test/code-qr',
            'A7B7434617A74',
            'BAPTISTE BLETEAU',
            'DATA FORMA',
            sigs,
            '11/07/2026 \u00e0 17:31',
        )

        self.assertTrue(url.startswith('https://example.test/code-qr/#d='))
        self.assertEqual(
            decode_payload(url.split('#d=', 1)[1]),
            {
                'env': 'A7B7434617A74',
                'stag': 'BAPTISTE BLETEAU',
                'org': 'DATA FORMA',
                'sigs': sigs,
                'seal': '11/07/2026 \u00e0 17:31',
            },
        )

    def test_crm_aliases_map_into_public_envelope_payload(self):
        payload = build_envelope_payload({
            'envelope_id': 'ENV-99',
            'organisme': 'DATA FORMA',
            'intitule_document': 'Attestation',
            'status': 'En cours',
            'trainee': 'BAPTISTE BLETEAU',
            'createdAt': '2026-05-11',
            'sha256': 'deadbeef',
            'signataires': [
                {
                    'name': 'Alice Example',
                    'role': 'G\u00e9rant',
                    'signedAt': '11/05/2026 \u00e0 15:02',
                    'email': 'alice@example.test',
                    'ip': '203.0.113.4',
                },
            ],
        })

        self.assertEqual(payload, {
            'id': 'ENV-99',
            'org': 'DATA FORMA',
            'doc': 'Attestation',
            'statut': 'En cours',
            'beneficiaire': 'BAPTISTE BLETEAU',
            'creeLe': '2026-05-11',
            'sha': 'deadbeef',
            'sigs': [{
                'n': 'Alice Example',
                'r': 'G\u00e9rant',
                'd': '11/05/2026 \u00e0 15:02',
                'e': 'alice@example.test',
                'ip': '203.0.113.4',
            }],
        })

    def test_missing_optional_signataire_fields_are_stable_empty_values(self):
        self.assertEqual(
            map_signataire({'nom': 'Alice Example'}),
            {'n': 'Alice Example', 'r': '', 'd': '', 'e': None, 'ip': None},
        )

    def test_verification_url_modes(self):
        self.assertEqual(
            build_verification_url('https://example.test/code-qr/', {'id': 'ENV-42'}),
            'https://example.test/code-qr/?id=ENV-42',
        )

        hash_url = build_verification_url(
            'https://example.test/code-qr',
            {'id': 'ENV-42', 'org': 'DATA FORMA'},
            mode='hash',
        )

        self.assertEqual(
            decode_payload(hash_url.split('#d=', 1)[1]),
            {'id': 'ENV-42', 'org': 'DATA FORMA'},
        )

        with self.assertRaisesRegex(ValueError, 'data.id requis'):
            build_verification_url('https://example.test/code-qr', {})


if __name__ == '__main__':
    unittest.main()
