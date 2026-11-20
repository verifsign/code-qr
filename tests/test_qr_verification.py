import sys
import unittest
import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location(
    'qr_verification',
    ROOT / 'integration' / 'crm' / 'qr_verification.py',
)
qr_verification = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qr_verification)


class LegacyHashUrlTests(unittest.TestCase):
    def test_build_legacy_hash_url_round_trips_current_crm_fields(self):
        signataires = [
            {'n': 'SITBON RICHARD', 'r': 'Gérant', 'd': '11/05/2026 à 15:02'},
            {'n': 'BAPTISTE BLETEAU', 'r': 'Stagiaire', 'd': '11/05/2026 à 16:30'},
        ]

        url = qr_verification.build_legacy_hash_url(
            'https://verifsign.github.io/code-qr',
            'A7B7434617A74',
            'BAPTISTE BLETEAU',
            'DATA FORMA',
            signataires,
            '11/07/2026 à 17:31',
        )

        self.assertTrue(url.startswith('https://verifsign.github.io/code-qr/#d='))
        encoded = url.split('#d=', 1)[1]
        self.assertEqual(
            qr_verification.decode_payload(encoded),
            {
                'env': 'A7B7434617A74',
                'stag': 'BAPTISTE BLETEAU',
                'org': 'DATA FORMA',
                'sigs': signataires,
                'seal': '11/07/2026 à 17:31',
            },
        )

    def test_build_legacy_hash_url_omits_empty_seal(self):
        url = qr_verification.build_legacy_hash_url(
            'https://verifsign.github.io/code-qr/',
            'A7B7434617A74',
            'BAPTISTE BLETEAU',
            'DATA FORMA',
            [],
        )

        encoded = url.split('#d=', 1)[1]
        self.assertNotIn('seal', qr_verification.decode_payload(encoded))


if __name__ == '__main__':
    unittest.main()
