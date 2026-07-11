#!/usr/bin/env python3
"""
Exemple : créer l'enveloppe BAPTISTE BLETEAU comme dans l'attestation fournie.
À lancer depuis la racine du CRM (avec app.py et la base initialisée).

  python integration/crm/examples/seed_bleteau.py --dossier-id 1
"""
from __future__ import annotations

import argparse
import os
import sys

# Permet l'import depuis la racine du CRM
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dossier-id', type=int, required=True)
    parser.add_argument('--db', default=None, help='Chemin crm_v2.db (optionnel)')
    args = parser.parse_args()

    # Import minimal — suppose que app.py est dans ROOT
    try:
        import app as crm
    except ImportError:
        print("Placez ce script dans le CRM et lancez depuis sa racine.")
        sys.exit(1)

    from integration.crm import register_signature_module

    svc = register_signature_module(
        crm.app,
        get_db=crm.get_db,
        output_folder=crm.OUTPUT_FOLDER,
        format_date_fr=crm.format_date_fr,
        code_qr_data_dir=os.path.join(ROOT, '..', 'code-qr', 'data', 'envelopes'),
    )

    eid = 'A7B7434617A74'
    try:
        r = svc.create_for_dossier(
            args.dossier_id,
            intitule_document=(
                "Dossier d'audit — NEGOCIATION ET DIGITALISATION "
                "DE LA RELATION CLIENT (BTS)"
            ),
        )
        print('Enveloppe créée :', r['envelope_id'])
    except ValueError as e:
        if 'déjà' in str(e).lower():
            rows = svc.list_by_dossier(args.dossier_id)
            eid = rows[0]['envelope_id'] if rows else eid
            print('Enveloppe existante :', eid)
        else:
            raise

    # Réimport données historiques RÉELLES (pas de datetime.now())
    conn = crm.get_db()
    env = conn.execute(
        'SELECT id FROM signature_envelopes WHERE envelope_id = ?', (eid,)).fetchone()
    if env:
        conn.execute('DELETE FROM signature_signataires WHERE envelope_row_id = ?', (env['id'],))
        conn.commit()
    conn.close()

    svc.record_signature(eid, 'SITBON RICHARD', 'Gérant — DATA FORMA',
                         email='dataforma.direction@gmail.com', ip='90.70.11.146',
                         signe_le='11/05/2026 à 15:02')
    svc.record_signature(eid, 'BAPTISTE BLETEAU', 'Stagiaire',
                         email='BLETEAU.BAPTISTE@HOTMAIL.COM', ip='176.140.211.27',
                         signe_le='11/05/2026 à 16:30')

    conn = crm.get_db()
    conn.execute('''
        UPDATE signature_envelopes
        SET statut = 'Terminé',
            hash_pdf = 'aa2cdef5a92cdd62a82cdbcfa72cda3ca62cd8a9a52cd716a42cd583a32cd3f0',
            cree_le = '2026-05-05'
        WHERE envelope_id = ?
    ''', (eid,))
    conn.commit()
    conn.close()

    qr = svc.generate_qr(eid)
    print('URL  :', qr['url'])
    print('QR   :', qr['qr_path'])
    print('JSON exporté vers code-qr/data/envelopes/' + eid + '.json')


if __name__ == '__main__':
    main()
