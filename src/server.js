import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

import { listDocuments, getDocument, upsertDocument, deleteDocument } from "./db.js";
import { requireApiKey } from "./auth.js";
import {
  newDocumentId,
  computeDataHash,
  validateDocumentPayload,
  toPublicDocument,
} from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(PUBLIC_DIR));

function baseUrl(req) {
  return (process.env.BASE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
}

function verificationUrl(req, id) {
  return `${baseUrl(req)}/v/${encodeURIComponent(id)}`;
}

// ---------------------------------------------------------------------------
// API - lecture publique (utilisée par la page de vérification)
// ---------------------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/documents/:id", async (req, res) => {
  const record = await getDocument(req.params.id);
  if (!record) {
    return res.status(404).json({ error: "Document introuvable." });
  }
  res.json(toPublicDocument(record));
});

app.get("/api/documents/:id/qr.png", async (req, res) => {
  const record = await getDocument(req.params.id);
  if (!record) return res.status(404).json({ error: "Document introuvable." });
  const size = Math.min(Math.max(Number(req.query.size) || 512, 128), 2048);
  const url = verificationUrl(req, record.id);
  const png = await QRCode.toBuffer(url, { type: "png", width: size, margin: 2 });
  res.set("Content-Type", "image/png");
  res.send(png);
});

app.get("/api/documents/:id/qr.svg", async (req, res) => {
  const record = await getDocument(req.params.id);
  if (!record) return res.status(404).json({ error: "Document introuvable." });
  const url = verificationUrl(req, record.id);
  const svg = await QRCode.toString(url, { type: "svg", margin: 2 });
  res.set("Content-Type", "image/svg+xml");
  res.send(svg);
});

// ---------------------------------------------------------------------------
// API - écriture, protégée par clé API (à utiliser depuis le CRM)
// ---------------------------------------------------------------------------

app.get("/api/documents", requireApiKey, async (req, res) => {
  const docs = await listDocuments();
  res.json(docs.map(toPublicDocument));
});

app.post("/api/documents", requireApiKey, async (req, res) => {
  const { errors, signers } = validateDocumentPayload(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const id = (req.body.id && String(req.body.id).trim()) || newDocumentId();
  const existing = await getDocument(id);
  if (existing) {
    return res.status(409).json({ error: `Un document avec l'identifiant "${id}" existe déjà. Utilise PUT pour le modifier.` });
  }

  const record = {
    id,
    org: req.body.org || process.env.DEFAULT_ORG || null,
    doc: req.body.doc || null,
    beneficiaire: req.body.beneficiaire || null,
    statut: req.body.statut || "En cours",
    sha: req.body.sha || null,
    signers,
    createdAt: req.body.createdAt || new Date().toISOString(),
    sealedAt: req.body.sealedAt || null,
  };
  record.dataHash = computeDataHash(record);

  await upsertDocument(id, record);
  res.status(201).json({
    document: toPublicDocument(record),
    verificationUrl: verificationUrl(req, id),
  });
});

app.put("/api/documents/:id", requireApiKey, async (req, res) => {
  const id = req.params.id;
  const existing = await getDocument(id);
  if (!existing) return res.status(404).json({ error: "Document introuvable." });

  const { errors, signers } = validateDocumentPayload(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const record = {
    ...existing,
    org: req.body.org ?? existing.org,
    doc: req.body.doc ?? existing.doc,
    beneficiaire: req.body.beneficiaire ?? existing.beneficiaire,
    statut: req.body.statut ?? existing.statut,
    sha: req.body.sha ?? existing.sha,
    signers: req.body.signers != null ? signers : existing.signers,
    sealedAt: req.body.sealedAt ?? existing.sealedAt,
  };
  record.dataHash = computeDataHash(record);

  await upsertDocument(id, record);
  res.json({
    document: toPublicDocument(record),
    verificationUrl: verificationUrl(req, id),
  });
});

app.delete("/api/documents/:id", requireApiKey, async (req, res) => {
  const removed = await deleteDocument(req.params.id);
  if (!removed) return res.status(404).json({ error: "Document introuvable." });
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Pages HTML
// ---------------------------------------------------------------------------

app.get("/v/:id", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "verify.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "admin.html"));
});

app.use((req, res) => {
  res.status(404).json({ error: "Route inconnue." });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur de vérification QR démarré sur http://localhost:${PORT}`);
  });
}

export default app;
