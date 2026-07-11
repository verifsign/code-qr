/**
 * Intégration CRM — génération de l'URL de vérification et du QR code.
 *
 * À brancher dans votre CRM à l'endroit où vous générez le PDF d'attestation.
 * Fonctionne pour TOUS les stagiaires : appelez buildVerificationUrl() avec
 * les données réelles du dossier de chaque stagiaire.
 *
 * IMPORTANT — trois règles pour que les informations affichées soient vraies :
 *  1. sigs[].d doit être l'horodatage RÉELLEMENT enregistré au moment où la
 *     personne a signé (champ signedAt en base), jamais une valeur calculée.
 *  2. sha doit être une empreinte SHA-256 réellement calculée. Comme le QR est
 *     inséré dans le PDF final, il ne peut pas contenir l'empreinte de ce même
 *     PDF (référence circulaire) : hachez le document source ou les données
 *     signées, et libellez-le ainsi via shaNote.
 *  3. Ne réutilisez pas des valeurs générées à partir du nom du stagiaire.
 */

/** URL publique de votre page de vérification (index.html hébergé). */
const VERIF_URL = "https://VOTRE-DOMAINE/verification/"; // ← à remplacer

/** Encodage base64url d'un objet JSON (navigateur et Node.js). */
function toB64Url(obj) {
  const json = JSON.stringify(obj);
  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(json, "utf8").toString("base64url");
}

/** Formate une date en "JJ/MM/AAAA à HH:MM" (heure de Paris). */
function formatDateFr(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  return fmt.format(d).replace(",", " à");
}

/**
 * Construit l'URL de vérification à encoder dans le QR code.
 *
 * @param {object} dossier - Données réelles issues de votre CRM :
 * {
 *   id:        "A7B7434617A74",              // identifiant réel du dossier
 *   organisme: "DATA FORMA",
 *   document:  "Dossier d'audit — BTS NDRC", // optionnel
 *   stagiaire: "BAPTISTE BLETEAU",           // optionnel
 *   creeLe:    "05/05/2026",                 // optionnel
 *   statut:    "Terminé",
 *   signataires: [{
 *     nom:      "SITBON RICHARD",
 *     role:     "Gérant — DATA FORMA",
 *     signedAt: dateEnregistreeEnBase,       // Date/ISO réellement enregistrée
 *     email:    "…",                         // optionnel
 *     ip:       "…",                         // optionnel : IP enregistrée à la signature
 *   }],
 *   sha256:    "…",                          // optionnel : empreinte réellement calculée
 *   shaNote:   "Empreinte des données signées (hors PDF final).", // optionnel
 * }
 * @returns {string} URL complète à passer à votre générateur de QR.
 */
function buildVerificationUrl(dossier) {
  if (!dossier || !dossier.id) throw new Error("dossier.id est obligatoire");

  const data = { id: dossier.id };
  if (dossier.organisme) data.org = dossier.organisme;
  if (dossier.document)  data.doc = dossier.document;
  if (dossier.stagiaire) data.ben = dossier.stagiaire;
  if (dossier.creeLe)    data.dc  = dossier.creeLe;
  if (dossier.statut)    data.statut = dossier.statut;

  if (Array.isArray(dossier.signataires) && dossier.signataires.length) {
    data.sigs = dossier.signataires.map((s) => {
      const sig = { n: s.nom };
      if (s.role)     sig.r = s.role;
      if (s.signedAt) sig.d = typeof s.signedAt === "string" && s.signedAt.includes("/")
                               ? s.signedAt : formatDateFr(s.signedAt);
      if (s.email)    sig.e = s.email;
      if (s.ip)       sig.i = s.ip;
      return sig;
    });
  }

  if (dossier.sha256)  data.sha = dossier.sha256;
  if (dossier.shaNote) data.shaNote = dossier.shaNote;

  return VERIF_URL + "#d=" + toB64Url(data);
}

/**
 * Calcule le SHA-256 réel d'un contenu (navigateur, Web Crypto API).
 * Utilisez-le sur le document source ou les données signées — pas sur le PDF
 * final qui contient le QR.
 *
 * @param {ArrayBuffer|Uint8Array|string} content
 * @returns {Promise<string>} empreinte hexadécimale
 */
async function sha256Hex(content) {
  const bytes = typeof content === "string" ? new TextEncoder().encode(content) : content;
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------ *
 * EXEMPLE D'UTILISATION dans votre CRM (au moment de générer le PDF) :
 *
 *   const url = buildVerificationUrl({
 *     id:        enveloppe.reference,
 *     organisme: "DATA FORMA",
 *     document:  enveloppe.titre,
 *     stagiaire: stagiaire.nomComplet,
 *     creeLe:    formatDateFr(enveloppe.createdAt).split(" à")[0],
 *     statut:    enveloppe.statut,
 *     signataires: enveloppe.signatures.map(s => ({
 *       nom:      s.signataire.nomComplet,
 *       role:     s.signataire.role,
 *       signedAt: s.signedAt,          // ← champ enregistré en base à la signature
 *       email:    s.signataire.email,
 *       ip:       s.ipEnregistree,     // ← IP capturée au moment de la signature
 *     })),
 *     sha256:  empreinteReelleDesDonneesSignees, // via sha256Hex(...)
 *     shaNote: "Empreinte SHA-256 des données signées, calculée à la signature.",
 *   });
 *
 *   // puis, avec votre lib QR habituelle (ex. qrcode) :
 *   //   QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 2 })
 *   //   → insérer l'image obtenue dans le PDF.
 * ------------------------------------------------------------------ */

// Export pour Node.js / bundlers ; en <script> classique les fonctions sont globales.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VERIF_URL, buildVerificationUrl, toB64Url, formatDateFr, sha256Hex };
}
