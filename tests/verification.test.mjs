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

test('hash payloads round-trip UTF-8 data using URL-safe base64', () => {
  const payload = {
    id: 'ENV-42',
    org: 'DATA FORMA',
    beneficiaire: 'B\u00e9n\u00e9ficiaire valid\u00e9',
    sigs: [{ n: 'Alice', r: 'G\u00e9rant', d: '11/05/2026 \u00e0 15:02' }],
  };

  const encoded = encodePayload(payload);

  assert.doesNotMatch(encoded, /[+/=]/);
  assert.deepEqual(decodePayload(encoded), payload);
});

test('legacy CRM env/stag/seal payloads normalize to the current envelope shape', () => {
  const sigs = [{ n: 'SITBON RICHARD', r: 'G\u00e9rant', d: '11/05/2026 \u00e0 15:02' }];
  const raw = buildLegacyHashPayload(
    'A7B7434617A74',
    'BAPTISTE BLETEAU',
    'DATA FORMA',
    sigs,
    '11/07/2026 \u00e0 17:31',
    { doc: 'Attestation', sha: 'abc123' },
  );

  assert.deepEqual(normalizePayload(raw), {
    id: 'A7B7434617A74',
    org: 'DATA FORMA',
    beneficiaire: 'BAPTISTE BLETEAU',
    statut: 'Termin\u00e9',
    scelleLe: '11/07/2026 \u00e0 17:31',
    sigs,
    doc: 'Attestation',
    sha: 'abc123',
  });
});

test('verification URLs choose hash payloads or encoded id query parameters', () => {
  const payload = { id: 'ENV 42/+', org: 'DATA FORMA' };

  const idUrl = buildVerificationUrl('https://example.test/code-qr/', payload);
  assert.equal(idUrl, 'https://example.test/code-qr/?id=ENV%2042%2F%2B');

  const hashUrl = buildVerificationUrl('https://example.test/code-qr', payload, 'hash');
  assert.equal(hashUrl.split('#d=').length, 2);
  assert.deepEqual(decodePayload(hashUrl.split('#d=')[1]), payload);

  assert.throws(
    () => buildVerificationUrl('https://example.test/code-qr', {}, 'id'),
    /data\.id is required/,
  );
});

test('CRM envelope aliases map into the public verification contract', () => {
  const payload = buildEnvelopePayload({
    envelopeId: 'ENV-99',
    organisme: 'DATA FORMA',
    intituleDocument: 'Attestation',
    status: 'En cours',
    trainee: 'BAPTISTE BLETEAU',
    createdAt: '2026-05-11',
    sha256: 'deadbeef',
    signataires: [
      {
        name: 'Alice Example',
        role: 'G\u00e9rant',
        signedAt: '11/05/2026 \u00e0 15:02',
        email: 'alice@example.test',
        ip: '203.0.113.4',
      },
    ],
  });

  assert.deepEqual(payload, {
    id: 'ENV-99',
    org: 'DATA FORMA',
    doc: 'Attestation',
    statut: 'En cours',
    beneficiaire: 'BAPTISTE BLETEAU',
    creeLe: '2026-05-11',
    sha: 'deadbeef',
    sigs: [{
      n: 'Alice Example',
      r: 'G\u00e9rant',
      d: '11/05/2026 \u00e0 15:02',
      e: 'alice@example.test',
      ip: '203.0.113.4',
    }],
  });
});
