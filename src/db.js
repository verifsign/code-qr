import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "documents.json");

let cache = null;
let writeQueue = Promise.resolve();

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ documents: {} }, null, 2));
  }
}

async function load() {
  if (cache) return cache;
  await ensureStore();
  const raw = await fs.readFile(DB_FILE, "utf8");
  try {
    cache = JSON.parse(raw);
  } catch {
    cache = { documents: {} };
  }
  if (!cache.documents) cache.documents = {};
  return cache;
}

function persist() {
  // Sérialise les écritures pour éviter les écritures concurrentes qui se corrompent.
  writeQueue = writeQueue.then(() =>
    fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2))
  );
  return writeQueue;
}

export async function listDocuments() {
  const db = await load();
  return Object.values(db.documents).sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
}

export async function getDocument(id) {
  const db = await load();
  return db.documents[id] || null;
}

export async function upsertDocument(id, record) {
  const db = await load();
  db.documents[id] = record;
  await persist();
  return record;
}

export async function deleteDocument(id) {
  const db = await load();
  const existed = Boolean(db.documents[id]);
  delete db.documents[id];
  if (existed) await persist();
  return existed;
}
