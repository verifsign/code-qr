import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEnvelopePayload,
  buildLegacyHashPayload,
  buildVerificationUrl,
  decodePayload,
  encodePayload,
  normalizePayload,
} from '../lib/verification.mjs';

test('encodePayload round-trips base64url data with accents and no padding', () => {
  const payload = {
    id: 'A7B7434617A74',
    beneficiaire: 'Élodie Bénichou',
    doc: 'Attestation règlementaire',
  };

  const encoded = encodePayload(payload);

  assert.doesNotMatch(encoded, /[+/=]/);
  assert.deepEqual(decodePayload(encoded), payload);
});

test('normalizePayload preserves current envelope payloads unchanged', () => {
  const current = {
    id: 'ENV-2026-001',
    org: 'DATA FORMA',
    beneficiaire: 'Baptiste Bleteau',
    statut: 'En cours',
    sigs: [],
  };

  assert.strictEqual(normalizePayload(current), current);
});

test('normalizePayload maps legacy CRM hash payloads to display fields', () => {
  const legacy = buildLegacyHashPayload(
    'LEGACY-42',
    'Baptiste Bleteau',
    'DATA FORMA',
    [{ n: 'Gestionnaire', r: 'Organisme', d: '11/05/2026 à 15:02' }],
    '11/05/2026 à 15:05',
    { doc: 'Attestation de formation', sha: 'abc123' },
  );

  assert.deepEqual(normalizePayload(legacy), {
    id: 'LEGACY-42',
    org: 'DATA FORMA',
    beneficiaire: 'Baptiste Bleteau',
    statut: 'Terminé',
    scelleLe: '11/05/2026 à 15:05',
    sigs: [{ n: 'Gestionnaire', r: 'Organisme', d: '11/05/2026 à 15:02' }],
    doc: 'Attestation de formation',
    sha: 'abc123',
  });
});

test('buildVerificationUrl encodes id mode and embeds hash mode data', () => {
  assert.equal(
    buildVerificationUrl('https://verifsign.example/verify', { id: 'ENV 42/é' }),
    'https://verifsign.example/verify/?id=ENV%2042%2F%C3%A9',
  );

  const hashUrl = buildVerificationUrl('https://verifsign.example/verify/', { id: 'ENV-42' }, 'hash');
  const encoded = new URL(hashUrl).hash.replace(/^#d=/, '');

  assert.deepEqual(decodePayload(encoded), { id: 'ENV-42' });
});

test('buildEnvelopePayload accepts CRM field aliases and signataire date aliases', () => {
  assert.deepEqual(
    buildEnvelopePayload({
      envelopeId: 'ENV-99',
      organisme: 'DATA FORMA',
      intituleDocument: 'Attestation eIDAS',
      status: 'Terminé',
      stagiaire: 'Baptiste Bleteau',
      createdAt: '2026-05-11',
      sha256: 'deadbeef',
      signataires: [
        {
          name: 'Alice',
          r: 'Responsable',
          signedAt: '11/05/2026 à 15:02',
          email: 'alice@example.test',
        },
      ],
    }),
    {
      id: 'ENV-99',
      org: 'DATA FORMA',
      doc: 'Attestation eIDAS',
      statut: 'Terminé',
      beneficiaire: 'Baptiste Bleteau',
      creeLe: '2026-05-11',
      sha: 'deadbeef',
      sigs: [
        {
          n: 'Alice',
          r: 'Responsable',
          d: '11/05/2026 à 15:02',
          e: 'alice@example.test',
          ip: undefined,
        },
      ],
    },
  );
});
