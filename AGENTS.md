# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
Static single-page web app for verifying signed documents via QR code (French UI). Core files:
- `index.html` + `lib/verification.js` — the verification page (no build step, pure static).
- `data/envelopes/{id}.json` — one record per document; the page fetches these by `?id=`.
- `scripts/generate-qr.mjs` (`npm run qr`) and `scripts/sync-envelope.mjs` (`npm run sync`) — Node CLI tooling.
- `integration/crm/` — optional Python/Flask library meant to be **copied into an external Flask CRM**, not run standalone (see below).

### Running / building / testing
- Run the app: `npm run serve` (serves the repo root on port 4173 via `serve`). Open `http://localhost:4173/?id=A7B7434617A74` to see the sample document. The app can also load data from an inline hash URL (`#d=<base64url>`) or a remote CRM API (`?id=XXX&api=http://host`).
- Generate a QR: `npm run qr -- --id A7B7434617A74` (or `--file <path>`, `--mode hash`). Output PNG goes to `output/` (gitignored).
- Import CRM exports: `npm run sync -- <file-or-dir.json>` writes normalized records into `data/envelopes/`.
- Lint: none configured. Tests: none configured (no test framework in this repo).
- Build: none — it is a static site, there is no production build/bundle step.

### Non-obvious notes
- `npm run serve` uses `npx serve`; the first invocation may fetch `serve` if not already cached. Deps are otherwise installed by the update script (`npm install`).
- The Python module in `integration/crm/` imports `flask` but `flask` is intentionally **not** in `integration/crm/requirements.txt` (only `qrcode`/`Pillow`). It is a Blueprint factory (`register_signature_module`) requiring host-provided callbacks (`get_db`, `format_date_fr`, ...); it cannot be imported or run on its own here. Do not add Flask to the update script — treat this module as reference/integration code for an external CRM.
