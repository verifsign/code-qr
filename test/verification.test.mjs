import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLegacyHashPayload,
  buildLegacyHashUrl,
  buildVerificationUrl,
} from '../lib/verification.mjs';

test('buildVerificationUrl generates server-backed id URLs', () => {
  assert.equal(
    buildVerificationUrl('https://example.test/verify', { id: 'ABC 123' }),
    'https://example.test/verify/?id=ABC%20123',
  );
});

test('buildVerificationUrl rejects unsigned hash-mode URLs', () => {
  assert.throws(
    () => buildVerificationUrl('https://example.test/verify', { id: 'ABC123' }, 'hash'),
    /hash mode is not supported/,
  );
});

test('legacy hash helpers do not produce trusted verifier URLs', () => {
  const payload = buildLegacyHashPayload('ENV1', 'Alice', 'Org', [], 'today');
  assert.throws(
    () => buildLegacyHashUrl('https://example.test/verify', payload),
    /hash mode is not supported/,
  );
});
