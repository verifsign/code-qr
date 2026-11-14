import os
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from integration.crm import qr_verification
from integration.crm.signature_service import SignatureService


class QrVerificationTests(unittest.TestCase):
    def test_hash_payload_round_trips_without_padding(self):
        payload = {
            "env": "ENV-42",
            "stag": "Anais Test",
            "org": "DATA/FORMA",
            "sigs": [{"n": "Alice Martin", "r": "Direction"}],
            "seal": "11/05/2026 a 15:05",
        }

        encoded = qr_verification.encode_payload(payload)

        self.assertNotRegex(encoded, r"[+/=]")
        self.assertEqual(qr_verification.decode_payload(encoded), payload)

    def test_build_verification_url_requires_id_for_id_mode(self):
        self.assertEqual(
            qr_verification.build_verification_url(
                "https://example.test/verify/", {"id": "ENV-42"}
            ),
            "https://example.test/verify/?id=ENV-42",
        )
        with self.assertRaisesRegex(ValueError, "data.id requis"):
            qr_verification.build_verification_url("https://example.test/verify", {})

    def test_build_envelope_payload_maps_crm_aliases(self):
        payload = qr_verification.build_envelope_payload(
            {
                "envelope_id": "ENV-123",
                "organisme": "DATA FORMA",
                "intitule_document": "Attestation eIDAS",
                "status": "En cours",
                "stagiaire": "Baptiste",
                "cree_le": "2026-05-11",
                "hash_pdf": "deadbeef",
                "signataires": [
                    {
                        "name": "Alice Martin",
                        "role": "Direction",
                        "signedAt": "11/05/2026 a 15:02",
                        "email": "alice@example.test",
                    }
                ],
            }
        )

        self.assertEqual(
            payload,
            {
                "id": "ENV-123",
                "org": "DATA FORMA",
                "doc": "Attestation eIDAS",
                "statut": "En cours",
                "beneficiaire": "Baptiste",
                "creeLe": "2026-05-11",
                "sha": "deadbeef",
                "sigs": [
                    {
                        "n": "Alice Martin",
                        "r": "Direction",
                        "d": "11/05/2026 a 15:02",
                        "e": "alice@example.test",
                        "ip": None,
                    }
                ],
            },
        )


class SignatureServiceTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.db_path = os.path.join(self.tmp.name, "crm.sqlite")
        self.output_dir = os.path.join(self.tmp.name, "qr")
        self.export_dir = os.path.join(self.tmp.name, "envelopes")
        self._init_crm_tables()
        self.service = SignatureService(
            self._connect,
            self.output_dir,
            "https://verifsign.example/verify",
            format_date_fr=lambda value: f"FR:{value}" if value else "",
            code_qr_data_dir=self.export_dir,
        )

    def _connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_crm_tables(self):
        conn = self._connect()
        try:
            conn.executescript(
                """
                CREATE TABLE organismes (
                    id INTEGER PRIMARY KEY,
                    nom TEXT NOT NULL,
                    gerant TEXT
                );
                CREATE TABLE dossiers (
                    id INTEGER PRIMARY KEY,
                    organisme_id INTEGER NOT NULL,
                    participant TEXT NOT NULL,
                    titre_formation TEXT,
                    FOREIGN KEY (organisme_id) REFERENCES organismes(id)
                );
                INSERT INTO organismes (id, nom, gerant)
                VALUES (1, 'DATA FORMA', 'Gerant Test');
                INSERT INTO dossiers (id, organisme_id, participant, titre_formation)
                VALUES (10, 1, 'Baptiste Bleteau', 'Formation securite');
                """
            )
            conn.commit()
        finally:
            conn.close()

    def test_create_for_dossier_blocks_duplicate_active_envelopes(self):
        with patch(
            "integration.crm.signature_service.generate_envelope_id",
            side_effect=["ENV-ACTIVE", "ENV-DUPLICATE"],
        ):
            created = self.service.create_for_dossier(
                10,
                signataires_initiaux=[
                    {
                        "nom": "Alice Martin",
                        "role": "Direction",
                        "signed": True,
                    },
                    {
                        "nom": "Bob Sans Date",
                        "role": "Observateur",
                    },
                ],
            )

            self.assertEqual(created["envelope_id"], "ENV-ACTIVE")
            with self.assertRaisesRegex(ValueError, "Enveloppe active"):
                self.service.create_for_dossier(10)

        payload = self.service.get_payload("ENV-ACTIVE")
        self.assertEqual(payload["id"], "ENV-ACTIVE")
        self.assertEqual(payload["org"], "DATA FORMA")
        self.assertEqual(payload["beneficiaire"], "Baptiste Bleteau")
        self.assertEqual(payload["doc"], "Formation securite")
        self.assertEqual(len(payload["sigs"]), 1)
        self.assertEqual(payload["sigs"][0]["n"], "Alice Martin")

    def test_sealed_envelope_is_exported_and_rejects_new_signatures(self):
        with patch(
            "integration.crm.signature_service.generate_envelope_id",
            return_value="ENV-SEAL",
        ):
            self.service.create_for_dossier(10)

        self.service.record_signature(
            "ENV-SEAL",
            nom="Alice Martin",
            role="Direction",
            signe_le="11/05/2026 a 15:02",
        )
        result = self.service.seal_envelope("ENV-SEAL")

        self.assertEqual(result["statut"], "Terminé")
        self.assertTrue(os.path.exists(os.path.join(self.export_dir, "ENV-SEAL.json")))
        with self.assertRaisesRegex(ValueError, "déjà scellée"):
            self.service.record_signature("ENV-SEAL", nom="Late Signer")


if __name__ == "__main__":
    unittest.main()
