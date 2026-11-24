import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEnvelopePayload,
  buildLegacyHashPayload,
  buildLegacyHashUrl,
  buildVerificationUrl,
  decodePayload,
  encodePayload,
  normalizePayload,
} from '../lib/verification.mjs';

test('encodes and decodes unicode payloads with URL-safe base64', () => {
  const payload = {
    id: 'A7B7434617A74',
    org: 'DATA FORMA',
    beneficiaire: 'Baptiste Bléteau',
    sigs: [{ n: 'Zoë Martin', r: 'Gérant', d: '11/05/2026 à 15:02' }],
  };

  const encoded = encodePayload(payload);

  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodePayload(encoded), payload);
});

test('normalizes legacy CRM hash payloads without dropping seal metadata', () => {
  const legacy = buildLegacyHashPayload(
    'ENV-123',
    'Baptiste Bleteau',
    'DATA FORMA',
    [{ n: 'Marie Dupont', r: 'Responsable', d: '11/05/2026 à 15:02' }],
    '12/05/2026 à 09:30',
    { doc: 'Attestation finale', sha: 'abc123' },
  );

  assert.deepEqual(normalizePayload(legacy), {
    id: 'ENV-123',
    org: 'DATA FORMA',
    beneficiaire: 'Baptiste Bleteau',
    statut: 'Terminé',
    scelleLe: '12/05/2026 à 09:30',
    sigs: [{ n: 'Marie Dupont', r: 'Responsable', d: '11/05/2026 à 15:02' }],
    doc: 'Attestation finale',
    sha: 'abc123',
  });
});

test('builds verifiable URLs for id and legacy hash modes', () => {
  assert.equal(
    buildVerificationUrl('https://verifsign.github.io/code-qr', { id: 'A B/42' }),
    'https://verifsign.github.io/code-qr/?id=A%20B%2F42',
  );

  const payload = buildLegacyHashPayload('ENV-42', 'Stagiaire', 'Organisme', [], '');
  const url = buildLegacyHashUrl('https://verifsign.github.io/code-qr/', payload);
  const encoded = url.split('#d=')[1];

  assert.equal(url.startsWith('https://verifsign.github.io/code-qr/#d='), true);
  assert.deepEqual(decodePayload(encoded), payload);
});

test('maps CRM exports to the verification envelope schema', () => {
  const crm = {
    envelopeId: 'ENV-123',
    organisme: 'DATA FORMA',
    intituleDocument: 'Attestation de formation',
    status: 'Terminé',
    stagiaire: 'Baptiste Bleteau',
    createdAt: '2026-05-11',
    hashPdf: 'deadbeef',
    signataires: [
      {
        nom: 'Marie Dupont',
        role: 'Gérante',
        dateHeureEnregistree: '11/05/2026 à 15:02',
        email: 'marie@example.test',
        ip: '127.0.0.1',
      },
    ],
  };

  assert.deepEqual(buildEnvelopePayload(crm), {
    id: 'ENV-123',
    org: 'DATA FORMA',
    doc: 'Attestation de formation',
    statut: 'Terminé',
    beneficiaire: 'Baptiste Bleteau',
    creeLe: '2026-05-11',
    sha: 'deadbeef',
    sigs: [
      {
        n: 'Marie Dupont',
        r: 'Gérante',
        d: '11/05/2026 à 15:02',
        e: 'marie@example.test',
        ip: '127.0.0.1',
      },
    ],
  });
});
