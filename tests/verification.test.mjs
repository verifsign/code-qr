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
  it('normalizes legacy CRM hash payloads into the verification page shape', () => {
    const legacy = buildLegacyHashPayload(
      'A7B7434617A74',
      'BAPTISTE BLETEAU',
      'DATA FORMA',
      [{ n: 'Alice Martin', r: 'Responsable', d: '11/05/2026 a 15:02' }],
      '11/05/2026 a 15:05',
      { doc: 'Convention de formation', sha: 'abc123' },
    );

    assert.deepEqual(normalizePayload(legacy), {
      id: 'A7B7434617A74',
      org: 'DATA FORMA',
      beneficiaire: 'BAPTISTE BLETEAU',
      statut: 'Terminé',
      scelleLe: '11/05/2026 a 15:05',
      sigs: [{ n: 'Alice Martin', r: 'Responsable', d: '11/05/2026 a 15:02' }],
      doc: 'Convention de formation',
      sha: 'abc123',
    });
  });

  it('round-trips hash URLs without base64 padding or unsafe URL characters', () => {
    const payload = { env: 'ENV-42', stag: 'Anaïs <Test>', org: 'DATA/FORMA', sigs: [] };
    const url = buildLegacyHashUrl('https://example.test/verify', payload);
    const encoded = new URL(url).hash.slice('#d='.length);

    assert.equal(url, `https://example.test/verify/#d=${encoded}`);
    assert.doesNotMatch(encoded, /[+/=]/);
    assert.deepEqual(decodePayload(encoded), payload);
  });

  it('keeps id-mode URLs strict about envelope ids', () => {
    assert.equal(
      buildVerificationUrl('https://example.test/verify/', { id: 'ENV 42' }),
      'https://example.test/verify/?id=ENV%2042',
    );
    assert.throws(
      () => buildVerificationUrl('https://example.test/verify', {}),
      /data\.id is required/,
    );
  });

  it('maps CRM envelope records and signataire aliases consistently', () => {
    assert.deepEqual(
      buildEnvelopePayload({
        envelopeId: 'ENV-123',
        organisme: 'DATA FORMA',
        intituleDocument: 'Attestation eIDAS',
        status: 'En cours',
        trainee: 'Baptiste',
        createdAt: '2026-05-11',
        sha256: 'deadbeef',
        signataires: [
          {
            name: 'Alice Martin',
            role: 'Direction',
            signedAt: '11/05/2026 a 15:02',
            email: 'alice@example.test',
          },
        ],
      }),
      {
        id: 'ENV-123',
        org: 'DATA FORMA',
        doc: 'Attestation eIDAS',
        statut: 'En cours',
        beneficiaire: 'Baptiste',
        creeLe: '2026-05-11',
        sha: 'deadbeef',
        sigs: [
          {
            n: 'Alice Martin',
            r: 'Direction',
            d: '11/05/2026 a 15:02',
            e: 'alice@example.test',
            ip: undefined,
          },
        ],
      },
    );
  });

  it('encodes JSON payloads as URL-safe base64', () => {
    const payload = { id: 'ENV-1', beneficiaire: 'Zoë & Co' };
    const encoded = encodePayload(payload);

    assert.doesNotMatch(encoded, /[+/=]/);
    assert.deepEqual(decodePayload(encoded), payload);
  });
});
