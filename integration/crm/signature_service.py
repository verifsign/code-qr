"""
Couche base de données — enveloppes de signature liées aux dossiers/stagiaires.
"""
from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime
from typing import Any, Callable

from .qr_verification import (
    build_envelope_payload,
    format_signe_le,
    generate_envelope_id,
    sha256_file,
)


def init_signature_tables(conn: sqlite3.Connection) -> None:
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS signature_envelopes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            envelope_id TEXT UNIQUE NOT NULL,
            dossier_id INTEGER,
            organisme_id INTEGER,
            intitule_document TEXT,
            statut TEXT DEFAULT 'En cours',
            hash_pdf TEXT,
            cree_le TEXT,
            scelle_le TEXT,
            fichier_pdf TEXT,
            qr_filename TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (dossier_id) REFERENCES dossiers(id),
            FOREIGN KEY (organisme_id) REFERENCES organismes(id)
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS signature_signataires (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            envelope_row_id INTEGER NOT NULL,
            nom TEXT NOT NULL,
            role TEXT,
            email TEXT,
            ip TEXT,
            signe_le TEXT NOT NULL,
            ordre INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (envelope_row_id) REFERENCES signature_envelopes(id)
        )
    ''')
    conn.commit()


def _row_to_payload(env: sqlite3.Row, signataires: list[sqlite3.Row],
                    format_date_fr: Callable | None = None) -> dict:
    fmt = format_date_fr or (lambda x: x or '')
    sigs = [{
        'nom': s['nom'],
        'role': s['role'] or '',
        'email': s['email'] or '',
        'ip': s['ip'] or '',
        'signe_le': s['signe_le'],
    } for s in signataires]

    return build_envelope_payload({
        'id': env['envelope_id'],
        'organisme': env['org_nom'] if 'org_nom' in env.keys() else '',
        'intitule_document': env['intitule_document'] or '',
        'statut': env['statut'] or 'En cours',
        'beneficiaire': env['participant'] if 'participant' in env.keys() else '',
        'cree_le': fmt(env['cree_le']) if env['cree_le'] else fmt(env['created_at'][:10] if env['created_at'] else ''),
        'hash_pdf': env['hash_pdf'] or None,
        'signataires': sigs,
    })


class SignatureService:
    def __init__(self, get_db: Callable, output_folder: str,
                 verif_base_url: str,
                 format_date_fr: Callable | None = None,
                 code_qr_data_dir: str | None = None):
        self.get_db = get_db
        self.output_folder = output_folder
        self.verif_base_url = verif_base_url
        self.format_date_fr = format_date_fr or (lambda x: x or '')
        self.code_qr_data_dir = code_qr_data_dir

    def ensure_tables(self) -> None:
        conn = self.get_db()
        try:
            init_signature_tables(conn)
        finally:
            conn.close()

    def create_for_dossier(self, dossier_id: int, intitule_document: str | None = None,
                           signataires_initiaux: list[dict] | None = None) -> dict:
        """Crée une enveloppe pour un stagiaire (dossier CRM)."""
        conn = self.get_db()
        c = conn.cursor()
        try:
            init_signature_tables(conn)
            row = c.execute('''
                SELECT d.*, o.id AS org_id, o.nom AS org_nom, o.gerant
                FROM dossiers d
                JOIN organismes o ON d.organisme_id = o.id
                WHERE d.id = ?
            ''', (dossier_id,)).fetchone()
            if not row:
                raise ValueError('Dossier introuvable')

            existing = c.execute(
                'SELECT envelope_id FROM signature_envelopes WHERE dossier_id = ? AND statut != ?',
                (dossier_id, 'Terminé')).fetchone()
            if existing:
                raise ValueError(f'Enveloppe active déjà : {existing["envelope_id"]}')

            eid = generate_envelope_id()
            doc_title = intitule_document or row['titre_formation'] or f"Dossier — {row['participant']}"
            cree_le = datetime.now().strftime('%Y-%m-%d')

            c.execute('''
                INSERT INTO signature_envelopes
                    (envelope_id, dossier_id, organisme_id, intitule_document, statut, cree_le)
                VALUES (?, ?, ?, ?, 'En cours', ?)
            ''', (eid, dossier_id, row['org_id'], doc_title, cree_le))
            env_row_id = c.lastrowid

            if signataires_initiaux:
                for i, s in enumerate(signataires_initiaux):
                    if s.get('signe_le') or s.get('signed'):
                        self._insert_signataire(c, env_row_id, s, ordre=i)
            elif row['gerant']:
                pass  # gérant ajouté manuellement à la signature

            conn.commit()
            return {'envelope_id': eid, 'dossier_id': dossier_id, 'statut': 'En cours'}
        finally:
            conn.close()

    def _insert_signataire(self, c, env_row_id: int, s: dict, ordre: int = 0) -> None:
        signe_le = s.get('signe_le')
        if not signe_le and s.get('signed'):
            signe_le = format_signe_le()
        if not signe_le:
            return
        c.execute('''
            INSERT INTO signature_signataires
                (envelope_row_id, nom, role, email, ip, signe_le, ordre)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            env_row_id,
            s.get('nom') or s.get('name') or '',
            s.get('role') or '',
            s.get('email') or '',
            s.get('ip') or '',
            signe_le,
            ordre,
        ))

    def record_signature(self, envelope_id: str, nom: str, role: str = '',
                         email: str = '', ip: str = '',
                         signe_le: str | None = None) -> dict:
        """Enregistre une signature avec horodatage RÉEL (maintenant si non fourni)."""
        conn = self.get_db()
        c = conn.cursor()
        try:
            env = c.execute(
                'SELECT * FROM signature_envelopes WHERE envelope_id = ?',
                (envelope_id,)).fetchone()
            if not env:
                raise ValueError('Enveloppe introuvable')
            if env['statut'] == 'Terminé':
                raise ValueError('Enveloppe déjà scellée')

            ts = signe_le or format_signe_le()
            ordre = c.execute(
                'SELECT COUNT(*) FROM signature_signataires WHERE envelope_row_id = ?',
                (env['id'],)).fetchone()[0]

            c.execute('''
                INSERT INTO signature_signataires
                    (envelope_row_id, nom, role, email, ip, signe_le, ordre)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (env['id'], nom, role, email, ip, ts, ordre))
            conn.commit()
            return {'envelope_id': envelope_id, 'nom': nom, 'signe_le': ts}
        finally:
            conn.close()

    def seal_envelope(self, envelope_id: str, pdf_path: str | None = None) -> dict:
        """Scelle l'enveloppe. Calcule SHA-256 du PDF si fourni."""
        conn = self.get_db()
        c = conn.cursor()
        try:
            env = c.execute(
                'SELECT * FROM signature_envelopes WHERE envelope_id = ?',
                (envelope_id,)).fetchone()
            if not env:
                raise ValueError('Enveloppe introuvable')

            hash_pdf = None
            fichier_pdf = env['fichier_pdf']
            path = pdf_path or (os.path.join(self.output_folder, fichier_pdf) if fichier_pdf else None)
            if path and os.path.isfile(path):
                hash_pdf = sha256_file(path)
                if not fichier_pdf:
                    fichier_pdf = os.path.basename(path)

            scelle_le = format_signe_le()
            c.execute('''
                UPDATE signature_envelopes
                SET statut = 'Terminé', hash_pdf = ?, scelle_le = ?, fichier_pdf = COALESCE(?, fichier_pdf)
                WHERE envelope_id = ?
            ''', (hash_pdf, scelle_le, fichier_pdf, envelope_id))
            conn.commit()

            payload = self.get_payload(envelope_id)
            self._export_json(envelope_id, payload)
            return {'envelope_id': envelope_id, 'statut': 'Terminé', 'hash_pdf': hash_pdf}
        finally:
            conn.close()

    def get_payload(self, envelope_id: str) -> dict:
        conn = self.get_db()
        c = conn.cursor()
        try:
            env = c.execute('''
                SELECT e.*, d.participant, o.nom AS org_nom
                FROM signature_envelopes e
                LEFT JOIN dossiers d ON e.dossier_id = d.id
                LEFT JOIN organismes o ON e.organisme_id = o.id
                WHERE e.envelope_id = ?
            ''', (envelope_id,)).fetchone()
            if not env:
                raise ValueError('Enveloppe introuvable')
            sigs = c.execute('''
                SELECT * FROM signature_signataires
                WHERE envelope_row_id = ?
                ORDER BY ordre, id
            ''', (env['id'],)).fetchall()
            return _row_to_payload(env, sigs, self.format_date_fr)
        finally:
            conn.close()

    def list_by_dossier(self, dossier_id: int) -> list[dict]:
        conn = self.get_db()
        c = conn.cursor()
        try:
            rows = c.execute('''
                SELECT envelope_id, statut, intitule_document, cree_le, scelle_le
                FROM signature_envelopes WHERE dossier_id = ?
                ORDER BY created_at DESC
            ''', (dossier_id,)).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def list_all(self, statut: str | None = None) -> list[dict]:
        conn = self.get_db()
        c = conn.cursor()
        try:
            q = '''
                SELECT e.envelope_id, e.statut, e.intitule_document, e.cree_le,
                       d.participant, o.nom AS organisme
                FROM signature_envelopes e
                LEFT JOIN dossiers d ON e.dossier_id = d.id
                LEFT JOIN organismes o ON e.organisme_id = o.id
            '''
            params: tuple = ()
            if statut:
                q += ' WHERE e.statut = ?'
                params = (statut,)
            q += ' ORDER BY e.created_at DESC'
            return [dict(r) for r in c.execute(q, params).fetchall()]
        finally:
            conn.close()

    def _export_json(self, envelope_id: str, payload: dict) -> str | None:
        if not self.code_qr_data_dir:
            return None
        os.makedirs(self.code_qr_data_dir, exist_ok=True)
        path = os.path.join(self.code_qr_data_dir, f'{envelope_id}.json')
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
            f.write('\n')
        return path

    def generate_qr(self, envelope_id: str, mode: str = 'id') -> dict:
        from .qr_verification import build_verification_url, generate_qr_png

        payload = self.get_payload(envelope_id)
        url = build_verification_url(self.verif_base_url, payload, mode)
        os.makedirs(self.output_folder, exist_ok=True)
        qr_name = f'qr-{envelope_id}.png'
        qr_path = os.path.join(self.output_folder, qr_name)
        generate_qr_png(url, qr_path)

        conn = self.get_db()
        try:
            conn.execute(
                'UPDATE signature_envelopes SET qr_filename = ? WHERE envelope_id = ?',
                (qr_name, envelope_id))
            conn.commit()
        finally:
            conn.close()

        self._export_json(envelope_id, payload)
        return {'envelope_id': envelope_id, 'url': url, 'qr_filename': qr_name, 'qr_path': qr_path}
