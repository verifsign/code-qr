import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildEnvelopePayload,
  buildLegacyHashPayload,
  buildLegacyHashUrl,
  buildVerificationUrl,
  decodePayload,
  encodePayload,
  normalizePayload,
} from '../lib/verification.mjs';

describe('verification payload helpers', () => {
  it('round-trips URL-safe payloads with French characters', () => {
    const payload = {
      id: 'ENV-123',
      beneficiaire: 'Élodie Martin',
      sigs: [{ n: 'Gérant DATA FORMA', d: '11/05/2026 à 15:02' }],
    };

    assert.deepEqual(decodePayload(encodePayload(payload)), payload);
  });

  it('normalizes legacy CRM hash payloads used by existing QR codes', () => {
    const sigs = [{ n: 'BAPTISTE BLETEAU', r: 'Stagiaire', d: '11/05/2026 à 15:02' }];
    const legacy = buildLegacyHashPayload(
      'A7B7434617A74',
      'BAPTISTE BLETEAU',
      'DATA FORMA',
      sigs,
      '12/05/2026 à 09:30',
      { doc: 'Attestation eIDAS', sha: 'abc123' },
    );

    assert.deepEqual(normalizePayload(legacy), {
      id: 'A7B7434617A74',
      org: 'DATA FORMA',
      beneficiaire: 'BAPTISTE BLETEAU',
      statut: 'Terminé',
      scelleLe: '12/05/2026 à 09:30',
      sigs,
      doc: 'Attestation eIDAS',
      sha: 'abc123',
    });
  });

  it('builds verification URLs in id and legacy hash modes', () => {
    assert.equal(
      buildVerificationUrl('https://example.test/verify', { id: 'ENV 12/34' }),
      'https://example.test/verify/?id=ENV%2012%2F34',
    );

    const url = buildLegacyHashUrl(
      'https://example.test/verify/',
      buildLegacyHashPayload('ENV123', 'Stagiaire', 'Organisme', [], '12/05/2026 à 09:30'),
    );
    const encoded = new URL(url).hash.slice('#d='.length);

    assert.equal(new URL(url).origin + new URL(url).pathname, 'https://example.test/verify/');
    assert.deepEqual(normalizePayload(decodePayload(encoded)), {
      id: 'ENV123',
      org: 'Organisme',
      beneficiaire: 'Stagiaire',
      statut: 'Terminé',
      scelleLe: '12/05/2026 à 09:30',
      sigs: [],
      doc: '',
      sha: undefined,
    });
  });

  it('maps CRM export aliases into the verification page payload format', () => {
    assert.deepEqual(buildEnvelopePayload({
      envelopeId: 'ENV456',
      organisme: 'DATA FORMA',
      intituleDocument: 'Convention de formation',
      status: 'En cours',
      stagiaire: 'Jane Doe',
      createdAt: '2026-05-11',
      hashPdf: 'deadbeef',
      signataires: [{
        nom: 'Richard Sitbon',
        role: 'Gérant',
        dateHeureEnregistree: '11/05/2026 à 15:02',
        email: 'richard@example.test',
        ip: '127.0.0.1',
      }],
    }), {
      id: 'ENV456',
      org: 'DATA FORMA',
      doc: 'Convention de formation',
      statut: 'En cours',
      beneficiaire: 'Jane Doe',
      creeLe: '2026-05-11',
      sha: 'deadbeef',
      sigs: [{
        n: 'Richard Sitbon',
        r: 'Gérant',
        d: '11/05/2026 à 15:02',
        e: 'richard@example.test',
        ip: '127.0.0.1',
      }],
    });
  });
});
