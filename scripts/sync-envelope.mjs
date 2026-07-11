#!/usr/bin/env node
/**
 * Sync one or many CRM envelope JSON files into data/envelopes/.
 * Your CRM should export records matching the schema in docs/schema-envelope.json.
 *
 * Usage:
 *   node scripts/sync-envelope.mjs path/to/export.json
 *   node scripts/sync-envelope.mjs path/to/folder/*.json
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Verification from '../lib/verification.mjs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'envelopes');

function collectFiles(paths){
  const files = [];
  for(const p of paths){
    const abs = resolve(p);
    const st = statSync(abs);
    if(st.isDirectory()){
      for(const name of readdirSync(abs)){
        if(name.endsWith('.json')) files.push(join(abs, name));
      }
    }else{
      files.push(abs);
    }
  }
  return files;
}

function syncOne(file){
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  const payload = Verification.buildEnvelopePayload(raw);
  if(!payload.id) throw new Error(`Missing id in ${file}`);
  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, `${payload.id}.json`);
  writeFileSync(dest, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return dest;
}

const inputs = process.argv.slice(2);
if(!inputs.length){
  console.error('Usage: npm run sync -- <fichier-ou-dossier.json> [...]');
  process.exit(1);
}

for(const file of collectFiles(inputs)){
  const dest = syncOne(file);
  console.log('Synchronisé :', basename(dest));
}
