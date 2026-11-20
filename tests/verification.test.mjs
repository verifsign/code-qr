import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLegacyHashPayload,
  buildLegacyHashUrl,
  decodePayload,
  normalizePayload,
} from '../lib/verification.mjs';

const legacySignataires = [
  { n: 'SITBON RICHARD', r: 'Gérant', d: '11/05/2026 à 15:02' },
  { n: 'BAPTISTE BLETEAU', r: 'Stagiaire', d: '11/05/2026 à 16:30' },
];

test('normalizes sealed legacy CRM QR payloads for the verification page', () => {
  const normalized = normalizePayload({
    env: 'A7B7434617A74',
    stag: 'BAPTISTE BLETEAU',
    org: 'DATA FORMA',
    sigs: legacySignataires,
    seal: '11/07/2026 à 17:31',
    doc: 'Attestation eIDAS',
    sha: 'abc123',
  });

  assert.deepEqual(normalized, {
    id: 'A7B7434617A74',
    org: 'DATA FORMA',
    beneficiaire: 'BAPTISTE BLETEAU',
    statut: 'Terminé',
    scelleLe: '11/07/2026 à 17:31',
    sigs: legacySignataires,
    doc: 'Attestation eIDAS',
    sha: 'abc123',
  });
});

test('leaves current id-based payloads unchanged', () => {
  const currentPayload = {
    id: 'A7B7434617A74',
    org: 'DATA FORMA',
    beneficiaire: 'BAPTISTE BLETEAU',
  };

  assert.equal(normalizePayload(currentPayload), currentPayload);
});

test('builds legacy hash URLs that round-trip through the decoder', () => {
  const payload = buildLegacyHashPayload(
    'A7B7434617A74',
    'BAPTISTE BLETEAU',
    'DATA FORMA',
    legacySignataires,
    '11/07/2026 à 17:31',
    { doc: 'Attestation eIDAS' },
  );

  const url = buildLegacyHashUrl('https://verifsign.github.io/code-qr', payload);
  assert.match(url, /^https:\/\/verifsign\.github\.io\/code-qr\/#d=/);

  const encoded = url.split('#d=')[1];
  assert.deepEqual(decodePayload(encoded), payload);
});
