import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone-index.html', import.meta.url), 'utf8');
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function renderStandalone(payload) {
  const card = { innerHTML: '' };
  const sandbox = {
    location: { hash: `#d=${encodePayload(payload)}` },
    document: {
      title: '',
      getElementById(id) {
        assert.equal(id, 'card');
        return card;
      },
    },
    atob(value) {
      return Buffer.from(value, 'base64').toString('binary');
    },
    escape,
    decodeURIComponent,
  };

  vm.createContext(sandbox);
  new vm.Script(script).runInContext(sandbox);
  return card.innerHTML;
}

assert.doesNotMatch(
  renderStandalone({ env: 'DRAFT123', stag: 'Jean Dupont', sigs: [] }),
  /Signature vérifiée/,
);

assert.match(
  renderStandalone({ env: 'DONE123', seal: '24/11/2026 à 10:00', sigs: [] }),
  /Signature vérifiée/,
);

assert.match(
  renderStandalone({ id: 'DONE456', statut: 'Terminé', sigs: [] }),
  /Signature vérifiée/,
);
