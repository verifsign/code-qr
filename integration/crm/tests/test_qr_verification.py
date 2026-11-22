import unittest
import importlib.util
from pathlib import Path
from urllib.parse import parse_qs, urlparse

MODULE_PATH = Path(__file__).resolve().parents[1] / 'qr_verification.py'
SPEC = importlib.util.spec_from_file_location('qr_verification', MODULE_PATH)
qr_verification = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(qr_verification)

build_envelope_payload = qr_verification.build_envelope_payload
build_legacy_hash_url = qr_verification.build_legacy_hash_url
build_verification_url = qr_verification.build_verification_url
decode_payload = qr_verification.decode_payload
encode_payload = qr_verification.encode_payload


class QrVerificationTests(unittest.TestCase):
    def test_encode_payload_round_trips_unicode_without_base64_padding(self):
        payload = {
            'id': 'A7B7434617A74',
            'beneficiaire': 'Élodie Bénichou',
            'doc': 'Attestation règlementaire',
        }

        encoded = encode_payload(payload)

        self.assertNotRegex(encoded, r'[+/=]')
        self.assertEqual(decode_payload(encoded), payload)

    def test_build_verification_url_id_mode_uses_single_trailing_slash(self):
        url = build_verification_url(
            'https://verifsign.example/verify/',
            {'id': 'ENV-42'},
        )

        parsed = urlparse(url)
        self.assertEqual(parsed.geturl(), 'https://verifsign.example/verify/?id=ENV-42')
        self.assertEqual(parse_qs(parsed.query), {'id': ['ENV-42']})

    def test_build_verification_url_requires_id_in_id_mode(self):
        with self.assertRaisesRegex(ValueError, 'data.id requis'):
            build_verification_url('https://verifsign.example/verify', {}, mode='id')

    def test_build_legacy_hash_url_embeds_current_crm_legacy_fields(self):
        url = build_legacy_hash_url(
            'https://verifsign.example/verify',
            env='LEGACY-42',
            stag='Baptiste Bleteau',
            org='DATA FORMA',
            sigs=[{'n': 'Alice', 'r': 'Responsable', 'd': '11/05/2026 à 15:02'}],
            seal='11/05/2026 à 15:05',
        )

        encoded = urlparse(url).fragment.removeprefix('d=')
        self.assertEqual(
            decode_payload(encoded),
            {
                'env': 'LEGACY-42',
                'stag': 'Baptiste Bleteau',
                'org': 'DATA FORMA',
                'sigs': [{'n': 'Alice', 'r': 'Responsable', 'd': '11/05/2026 à 15:02'}],
                'seal': '11/05/2026 à 15:05',
            },
        )

    def test_build_envelope_payload_accepts_crm_aliases_and_drops_missing_values(self):
        self.assertEqual(
            build_envelope_payload({
                'envelope_id': 'ENV-99',
                'organisme': 'DATA FORMA',
                'intitule_document': 'Attestation eIDAS',
                'status': 'Terminé',
                'stagiaire': 'Baptiste Bleteau',
                'createdAt': '2026-05-11',
                'sha256': 'deadbeef',
                'signataires': [{
                    'name': 'Alice',
                    'r': 'Responsable',
                    'signedAt': '11/05/2026 à 15:02',
                    'email': 'alice@example.test',
                }],
            }),
            {
                'id': 'ENV-99',
                'org': 'DATA FORMA',
                'doc': 'Attestation eIDAS',
                'statut': 'Terminé',
                'beneficiaire': 'Baptiste Bleteau',
                'creeLe': '2026-05-11',
                'sha': 'deadbeef',
                'sigs': [{
                    'n': 'Alice',
                    'r': 'Responsable',
                    'd': '11/05/2026 à 15:02',
                    'e': 'alice@example.test',
                    'ip': None,
                }],
            },
        )


if __name__ == '__main__':
    unittest.main()
