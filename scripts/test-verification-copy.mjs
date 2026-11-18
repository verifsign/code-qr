#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const files = {
  index: readFileSync(join(root, 'index.html'), 'utf8'),
  standalone: readFileSync(join(root, 'standalone-index.html'), 'utf8'),
};

const misleadingPhrases = [
  'Signature v\u00e9rifi\u00e9e',
  'Signature v\\u00e9rifi\\u00e9e',
  'Conforme au r\u00e8glement eIDAS',
  'Conforme au r\\u00e8glement eIDAS',
  "L'int\u00e9grit\u00e9 est garantie",
  "L\\'int\\u00e9grit\\u00e9 est garantie",
];

for (const [name, contents] of Object.entries(files)) {
  for (const phrase of misleadingPhrases) {
    assert.equal(
      contents.includes(phrase),
      false,
      `${name} must not present displayed envelope data as a verified eIDAS signature`
    );
  }
}

assert.match(files.index, /\(isComplete\(data\)\s*\?\s*'<div class="valid"/);
assert.match(files.standalone, /function isComplete\(data\)/);
assert.match(files.standalone, /\(complete \? '<div class="valid"/);
