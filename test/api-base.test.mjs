import assert from 'node:assert/strict';
import test from 'node:test';

import { getTrustedQueryApiBase } from '../lib/verification.mjs';

test('rejects a third-party public api override', () => {
  const apiBase = getTrustedQueryApiBase(
    'https://attacker.example',
    'https://verifsign.github.io/code-qr/?id=anything&api=https://attacker.example',
  );

  assert.equal(apiBase, null);
});

test('allows same-origin api overrides', () => {
  assert.equal(
    getTrustedQueryApiBase(
      'https://verifsign.github.io/code-qr',
      'https://verifsign.github.io/code-qr/?id=A7B7434617A74&api=https://verifsign.github.io/code-qr',
    ),
    'https://verifsign.github.io/code-qr',
  );

  assert.equal(
    getTrustedQueryApiBase(
      '/code-qr',
      'https://verifsign.github.io/code-qr/?id=A7B7434617A74&api=/code-qr',
    ),
    'https://verifsign.github.io/code-qr',
  );
});

test('allows localhost api overrides only from localhost verifier pages', () => {
  assert.equal(
    getTrustedQueryApiBase(
      'http://localhost:5050',
      'http://localhost:4173/?id=A7B7434617A74&api=http://localhost:5050',
    ),
    'http://localhost:5050',
  );

  assert.equal(
    getTrustedQueryApiBase(
      'http://localhost:5050',
      'https://verifsign.github.io/code-qr/?id=A7B7434617A74&api=http://localhost:5050',
    ),
    null,
  );
});
