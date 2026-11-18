import hashlib
import json
import os
import sqlite3
import tempfile
import unittest

from integration.crm.signature_service import SignatureService


class SignatureServiceTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.db_path = os.path.join(self.tmp.name, 'crm.sqlite')
        self.output_dir = os.path.join(self.tmp.name, 'qr')
        self.export_dir = os.path.join(self.tmp.name, 'envelopes')

        self._create_crm_tables()
        self.service = SignatureService(
            get_db=self.get_db,
            output_folder=self.output_dir,
            verif_base_url='https://verify.example.test',
            format_date_fr=lambda value: value or '',
            code_qr_data_dir=self.export_dir,
        )
        self.service.ensure_tables()

    def get_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _create_crm_tables(self):
        conn = self.get_db()
        try:
            conn.executescript('''
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
            ''')
            conn.execute(
                'INSERT INTO organismes (id, nom, gerant) VALUES (?, ?, ?)',
                (1, 'DATA FORMA', 'SITBON RICHARD'),
            )
            conn.execute(
                'INSERT INTO dossiers (id, organisme_id, participant, titre_formation) VALUES (?, ?, ?, ?)',
                (101, 1, 'BAPTISTE BLETEAU', 'Formation Python'),
            )
            conn.commit()
        finally:
            conn.close()

    def test_create_for_dossier_rejects_second_active_envelope(self):
        first = self.service.create_for_dossier(
            101,
            intitule_document='Attestation eIDAS',
            signataires_initiaux=[
                {
                    'nom': 'SITBON RICHARD',
                    'role': 'Gerant',
                    'signe_le': '11/05/2026 a 15:02',
                }
            ],
        )

        self.assertEqual(first['dossier_id'], 101)
        self.assertEqual(first['statut'], 'En cours')
        self.assertRegex(first['envelope_id'], r'^[0-9A-F]{12}$')

        with self.assertRaisesRegex(ValueError, 'Enveloppe active'):
            self.service.create_for_dossier(101)

        payload = self.service.get_payload(first['envelope_id'])
        self.assertEqual(payload['id'], first['envelope_id'])
        self.assertEqual(payload['org'], 'DATA FORMA')
        self.assertEqual(payload['beneficiaire'], 'BAPTISTE BLETEAU')
        self.assertEqual(payload['doc'], 'Attestation eIDAS')
        self.assertEqual(payload['sigs'][0]['n'], 'SITBON RICHARD')

    def test_seal_envelope_hashes_pdf_exports_payload_and_blocks_more_signatures(self):
        envelope = self.service.create_for_dossier(101)
        envelope_id = envelope['envelope_id']
        self.service.record_signature(
            envelope_id,
            nom='SITBON RICHARD',
            role='Gerant',
            email='gerant@example.test',
            ip='127.0.0.1',
            signe_le='11/05/2026 a 15:02',
        )
        self.service.record_signature(
            envelope_id,
            nom='BAPTISTE BLETEAU',
            role='Stagiaire',
            signe_le='11/05/2026 a 15:09',
        )

        pdf_path = os.path.join(self.tmp.name, 'attestation.pdf')
        pdf_bytes = b'%PDF-1.4 deterministic fixture\n'
        with open(pdf_path, 'wb') as f:
            f.write(pdf_bytes)
        expected_hash = hashlib.sha256(pdf_bytes).hexdigest()

        result = self.service.seal_envelope(envelope_id, pdf_path=pdf_path)

        self.assertEqual(result['statut'], 'Terminé')
        self.assertEqual(result['hash_pdf'], expected_hash)
        payload = self.service.get_payload(envelope_id)
        self.assertEqual(payload['statut'], 'Terminé')
        self.assertEqual(payload['sha'], expected_hash)
        self.assertEqual([sig['n'] for sig in payload['sigs']], ['SITBON RICHARD', 'BAPTISTE BLETEAU'])

        export_path = os.path.join(self.export_dir, f'{envelope_id}.json')
        with open(export_path, encoding='utf-8') as f:
            self.assertEqual(json.load(f), payload)

        with self.assertRaisesRegex(ValueError, 'deja scellee|déjà scellée'):
            self.service.record_signature(envelope_id, nom='Late signer')


if __name__ == '__main__':
    unittest.main()
