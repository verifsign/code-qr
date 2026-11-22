import assert from 'node:assert/strict';
import {
  getVerificationState,
  isPayloadComplete,
} from '../lib/verification.mjs';

const completedPayload = {
  id: 'A7B7434617A74',
  statut: 'Terminé',
  sigs: [{ n: 'Example', d: '02/07/2026 à 10:15' }],
};

assert.equal(isPayloadComplete(completedPayload), true);
assert.equal(isPayloadComplete({ id: 'DRAFT', statut: 'En cours' }), false);

const trusted = getVerificationState(completedPayload, { trusted: true });
assert.equal(trusted.trusted, true);
assert.equal(trusted.complete, true);
assert.equal(trusted.label, 'Signature vérifiée — Enveloppe terminée');

const embedded = getVerificationState(completedPayload, { trusted: false });
assert.equal(embedded.trusted, false);
assert.equal(embedded.complete, false);
assert.equal(embedded.label, 'Données QR non vérifiées');
assert.match(embedded.message, /embarquées dans l.URL/);

console.log('verification-state tests passed');
