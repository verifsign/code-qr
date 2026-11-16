import os
import sqlite3
import sys
import tempfile
import types
import unittest

flask_stub = types.ModuleType('flask')
flask_stub.Blueprint = object
flask_stub.jsonify = lambda *args, **kwargs: None
flask_stub.render_template_string = lambda *args, **kwargs: ''
flask_stub.request = types.SimpleNamespace(args={}, json=None, remote_addr='')
flask_stub.send_file = lambda *args, **kwargs: None
sys.modules.setdefault('flask', flask_stub)

from integration.crm.signature_service import SignatureService


class SignatureServiceSealTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.db_path = os.path.join(self.tmp.name, 'crm.db')
        self.output_dir = os.path.join(self.tmp.name, 'output')
        self.export_dir = os.path.join(self.tmp.name, 'exports')
        os.makedirs(self.output_dir)

        conn = self._connect()
        try:
            conn.executescript('''
                CREATE TABLE organismes (
                    id INTEGER PRIMARY KEY,
                    nom TEXT,
                    gerant TEXT
                );
                CREATE TABLE dossiers (
                    id INTEGER PRIMARY KEY,
                    participant TEXT,
                    titre_formation TEXT,
                    organisme_id INTEGER
                );
            ''')
            conn.execute(
                'INSERT INTO organismes (id, nom, gerant) VALUES (1, "DATA FORMA", "GERANT")')
            conn.execute('''
                INSERT INTO dossiers (id, participant, titre_formation, organisme_id)
                VALUES (42, "BAPTISTE BLETEAU", "BTS NDRC", 1)
            ''')
            conn.commit()
        finally:
            conn.close()

        self.service = SignatureService(
            get_db=self._connect,
            output_folder=self.output_dir,
            verif_base_url='https://example.test/verify/',
            code_qr_data_dir=self.export_dir,
        )
        self.service.ensure_tables()
        self.envelope_id = self.service.create_for_dossier(42)['envelope_id']

    def _connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _envelope_row(self):
        conn = self._connect()
        try:
            return conn.execute(
                'SELECT statut, hash_pdf, fichier_pdf FROM signature_envelopes WHERE envelope_id = ?',
                (self.envelope_id,),
            ).fetchone()
        finally:
            conn.close()

    def test_seal_requires_existing_pdf_before_marking_complete(self):
        missing_pdf = os.path.join(self.tmp.name, 'missing.pdf')

        with self.assertRaisesRegex(ValueError, 'PDF introuvable'):
            self.service.seal_envelope(self.envelope_id, pdf_path=missing_pdf)

        row = self._envelope_row()
        self.assertEqual(row['statut'], 'En cours')
        self.assertIsNone(row['hash_pdf'])
        self.assertIsNone(row['fichier_pdf'])
        self.assertFalse(
            os.path.exists(os.path.join(self.export_dir, f'{self.envelope_id}.json')))

    def test_seal_cannot_overwrite_existing_hash(self):
        pdf_path = os.path.join(self.tmp.name, 'attestation.pdf')
        with open(pdf_path, 'wb') as f:
            f.write(b'original signed document')
        first = self.service.seal_envelope(self.envelope_id, pdf_path=pdf_path)

        with self.assertRaisesRegex(ValueError, 'déjà scellée'):
            self.service.seal_envelope(self.envelope_id)

        row = self._envelope_row()
        self.assertEqual(row['statut'], 'Terminé')
        self.assertEqual(row['hash_pdf'], first['hash_pdf'])
        self.assertEqual(row['fichier_pdf'], 'attestation.pdf')


if __name__ == '__main__':
    unittest.main()
