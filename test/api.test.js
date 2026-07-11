import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "documents.json");

// Base de données isolée pour ne pas polluer des données réelles pendant les tests.
await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
await fs.writeFile(DATA_FILE, JSON.stringify({ documents: {} }, null, 2));

process.env.API_KEY = "test-key-for-automated-tests";
process.env.BASE_URL = "http://localhost:0";

const { default: app } = await import("../src/server.js");

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await fs.writeFile(DATA_FILE, JSON.stringify({ documents: {} }, null, 2));
});

test("health check répond ok", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body, { ok: true });
});

test("POST sans clé API est refusé", async () => {
  const res = await fetch(`${baseUrl}/api/documents`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 401);
});

test("POST avec un signataire sans nom est rejeté", async () => {
  const res = await fetch(`${baseUrl}/api/documents`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.API_KEY },
    body: JSON.stringify({ signers: [{ r: "Stagiaire" }] }),
  });
  assert.equal(res.status, 400);
});

test("cycle complet : création, lecture publique, QR, mise à jour, suppression", async () => {
  const createRes = await fetch(`${baseUrl}/api/documents`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.API_KEY },
    body: JSON.stringify({
      id: "TEST12345678",
      org: "DATA FORMA",
      doc: "Attestation de test",
      beneficiaire: "Jean Dupont",
      statut: "Terminé",
      signers: [
        { n: "Jean Dupont", r: "Stagiaire", d: "11/05/2026 à 16:30" },
        { n: "Richard Sitbon", r: "Gérant", d: "11/05/2026 à 15:02" },
      ],
    }),
  });
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.document.id, "TEST12345678");
  assert.equal(created.document.signers.length, 2);
  assert.ok(created.document.dataHash.length === 64);
  assert.equal(created.verificationUrl, "http://localhost:0/v/TEST12345678");

  // Lecture publique, sans clé API.
  const publicRes = await fetch(`${baseUrl}/api/documents/TEST12345678`);
  assert.equal(publicRes.status, 200);
  const publicDoc = await publicRes.json();
  assert.equal(publicDoc.beneficiaire, "Jean Dupont");
  assert.equal(publicDoc.signers[0].n, "Jean Dupont");

  // Le champ IP/email éventuel ne doit jamais être exposé publiquement.
  assert.equal(publicDoc.signers[0].email, undefined);
  assert.equal(publicDoc.signers[0].ip, undefined);

  // Doublon d'identifiant refusé.
  const dupRes = await fetch(`${baseUrl}/api/documents`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.API_KEY },
    body: JSON.stringify({ id: "TEST12345678", signers: [{ n: "x" }] }),
  });
  assert.equal(dupRes.status, 409);

  // Page HTML de vérification servie.
  const pageRes = await fetch(`${baseUrl}/v/TEST12345678`);
  assert.equal(pageRes.status, 200);
  assert.match(await pageRes.text(), /id="card"/);

  // QR code PNG généré.
  const qrRes = await fetch(`${baseUrl}/api/documents/TEST12345678/qr.png`);
  assert.equal(qrRes.status, 200);
  assert.equal(qrRes.headers.get("content-type"), "image/png");
  const qrBuffer = Buffer.from(await qrRes.arrayBuffer());
  assert.ok(qrBuffer.length > 100);

  // Mise à jour du statut.
  const putRes = await fetch(`${baseUrl}/api/documents/TEST12345678`, {
    method: "PUT",
    headers: { "content-type": "application/json", "x-api-key": process.env.API_KEY },
    body: JSON.stringify({ statut: "Scellé" }),
  });
  assert.equal(putRes.status, 200);
  const updated = await putRes.json();
  assert.equal(updated.document.statut, "Scellé");
  // La date de création est préservée lors d'une mise à jour partielle.
  assert.equal(updated.document.createdAt, created.document.createdAt);

  // Suppression.
  const delRes = await fetch(`${baseUrl}/api/documents/TEST12345678`, {
    method: "DELETE",
    headers: { "x-api-key": process.env.API_KEY },
  });
  assert.equal(delRes.status, 204);

  const afterDelete = await fetch(`${baseUrl}/api/documents/TEST12345678`);
  assert.equal(afterDelete.status, 404);
});

test("identifiant inconnu renvoie 404", async () => {
  const res = await fetch(`${baseUrl}/api/documents/inexistant`);
  assert.equal(res.status, 404);
});
