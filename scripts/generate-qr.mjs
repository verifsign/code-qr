#!/usr/bin/env node
/**
 * Generate a QR code PNG for a CRM envelope.
 *
 * Usage:
 *   node scripts/generate-qr.mjs --id A7B7434617A74
 *   node scripts/generate-qr.mjs --file data/envelopes/A7B7434617A74.json
 *   node scripts/generate-qr.mjs --file envelope.json --mode hash --out qr.png
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { VERIF_BASE_URL } from '../config.js';
import * as Verification from '../lib/verification.mjs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function parseArgs(argv){
  const out = { mode: 'id', base: VERIF_BASE_URL };
  for(let i = 2; i < argv.length; i++){
    const a = argv[i];
    if(a === '--id') out.id = argv[++i];
    else if(a === '--file') out.file = argv[++i];
    else if(a === '--mode') out.mode = argv[++i];
    else if(a === '--base') out.base = argv[++i];
    else if(a === '--out') out.out = argv[++i];
    else if(a === '--help' || a === '-h'){
      console.log(`Usage: npm run qr -- [--id ID | --file path.json] [--mode id|hash] [--base URL] [--out file.png]`);
      process.exit(0);
    }
  }
  return out;
}

function loadEnvelope(args){
  if(args.file){
    const path = resolve(root, args.file);
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  if(args.id){
    const path = join(root, 'data', 'envelopes', `${args.id}.json`);
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  throw new Error('Provide --id or --file');
}

const args = parseArgs(process.argv);
const data = loadEnvelope(args);
const url = Verification.buildVerificationUrl(args.base, data, args.mode);

const outPath = args.out
  ? resolve(root, args.out)
  : join(root, 'output', `qr-${data.id || 'document'}.png`);

mkdirSync(dirname(outPath), { recursive: true });

await QRCode.toFile(outPath, url, {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 512,
  color: { dark: '#1E3A5F', light: '#FFFFFF' }
});

console.log('URL de vérification :', url);
console.log('QR code généré     :', outPath);
