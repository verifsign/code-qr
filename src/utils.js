import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";

// Alphabet proche des identifiants d'enveloppe habituels (ex: A7B7434617A74).
const generateId = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 13);

export function newDocumentId() {
  return generateId();
}

/**
 * Empreinte des DONNÉES DE SIGNATURE (pas du PDF).
 *
 * Le QR ne contient qu'un identifiant + une URL : il n'embarque jamais lui-même
 * une empreinte. Cela évite la référence circulaire signalée dans la proposition
 * (« le QR est dans le PDF, il ne peut pas contenir l'empreinte de ce même PDF »).
 *
 * Si tu disposes d'une vraie empreinte SHA-256 du PDF final (calculée une fois le
 * document généré, donc après coup), stocke-la dans `sha` via l'API — elle sera
 * affichée séparément et clairement labellisée comme empreinte du document.
 */
export function computeDataHash(record) {
  const canonical = JSON.stringify({
    id: record.id,
    org: record.org || null,
    doc: record.doc || null,
    beneficiaire: record.beneficiaire || null,
    statut: record.statut || null,
    signers: (record.signers || []).map((s) => ({
      n: s.n || null,
      r: s.r || null,
      d: s.d || null,
    })),
  });
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function sanitizeSigner(input = {}) {
  const signer = {
    n: String(input.n || "").trim(),
    r: input.r ? String(input.r).trim() : "",
    d: input.d ? String(input.d).trim() : "",
  };
  // Champs conservés pour l'audit interne, jamais renvoyés par l'API publique.
  if (input.email) signer.email = String(input.email).trim();
  if (input.ip) signer.ip = String(input.ip).trim();
  return signer;
}

export function validateDocumentPayload(body) {
  const errors = [];

  if (!body || typeof body !== "object") {
    return { errors: ["Le corps de la requête doit être un objet JSON."] };
  }

  if (body.org != null && typeof body.org !== "string") {
    errors.push("`org` doit être une chaîne de caractères.");
  }
  if (body.doc != null && typeof body.doc !== "string") {
    errors.push("`doc` doit être une chaîne de caractères.");
  }
  if (body.beneficiaire != null && typeof body.beneficiaire !== "string") {
    errors.push("`beneficiaire` doit être une chaîne de caractères.");
  }
  if (body.statut != null && typeof body.statut !== "string") {
    errors.push("`statut` doit être une chaîne de caractères.");
  }
  if (body.sha != null && typeof body.sha !== "string") {
    errors.push("`sha` doit être une chaîne de caractères (empreinte SHA-256 hexadécimale).");
  }

  let signers = [];
  if (body.signers != null) {
    if (!Array.isArray(body.signers)) {
      errors.push("`signers` doit être un tableau d'objets { n, r, d }.");
    } else {
      signers = body.signers.map(sanitizeSigner);
      signers.forEach((s, i) => {
        if (!s.n) errors.push(`signers[${i}].n (nom du signataire) est requis.`);
      });
    }
  }

  return { errors, signers };
}

export function toPublicDocument(record) {
  if (!record) return null;
  return {
    id: record.id,
    org: record.org || null,
    doc: record.doc || null,
    beneficiaire: record.beneficiaire || null,
    statut: record.statut || null,
    createdAt: record.createdAt || null,
    sealedAt: record.sealedAt || null,
    sha: record.sha || null,
    dataHash: record.dataHash || null,
    signers: (record.signers || []).map((s) => ({ n: s.n, r: s.r, d: s.d })),
  };
}
