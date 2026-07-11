function b64urlEncode(str){
  var b64;
  if(typeof btoa === 'function'){
    b64 = btoa(unescape(encodeURIComponent(str)));
  }else{
    b64 = Buffer.from(str, 'utf8').toString('base64');
  }
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64urlDecode(s){
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while(s.length % 4) s += '=';
  try{
    if(typeof atob === 'function'){
      return decodeURIComponent(escape(atob(s)));
    }
    return Buffer.from(s, 'base64').toString('utf8');
  }catch(e){
    if(typeof atob === 'function') return atob(s);
    return Buffer.from(s, 'base64').toString('utf8');
  }
}

function esc(x){
  return String(x == null ? '' : x)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function encodePayload(obj){
  return b64urlEncode(JSON.stringify(obj));
}

function decodePayload(encoded){
  return JSON.parse(b64urlDecode(encoded));
}

function normalizePayload(raw){
  if(!raw || typeof raw !== 'object') return raw;
  if(raw.id) return raw;
  // Format legacy CRM (signelecverif) : env, stag, org, sigs, seal
  if(raw.env){
    return {
      id: raw.env,
      org: raw.org || '',
      beneficiaire: raw.stag || '',
      statut: raw.seal ? 'Terminé' : (raw.statut || ''),
      scelleLe: raw.seal || '',
      sigs: raw.sigs || [],
      doc: raw.doc || '',
      sha: raw.sha || undefined
    };
  }
  return raw;
}

function buildLegacyHashPayload(env, stag, org, sigs, seal, extra){
  var payload = { env: env, stag: stag, org: org, sigs: sigs || [] };
  if(seal) payload.seal = seal;
  if(extra) for(var k in extra) if(extra.hasOwnProperty(k)) payload[k] = extra[k];
  return payload;
}

function buildLegacyHashUrl(baseUrl, payload){
  return buildVerificationUrl(baseUrl, payload, 'hash');
}

function buildVerificationUrl(baseUrl, data, mode){
  var root = baseUrl.replace(/\/?$/, '/');
  if(mode === 'hash'){
    return root + '#d=' + encodePayload(data);
  }
  if(!data.id) throw new Error('data.id is required for id mode');
  return root + '?id=' + encodeURIComponent(data.id);
}

function mapSignataire(s){
  return {
    n: s.nom || s.n || s.name,
    r: s.role || s.r || '',
    d: s.signeLe || s.dateHeureEnregistree || s.d || s.signedAt || '',
    e: s.email || s.e || undefined,
    ip: s.ip || undefined
  };
}

function buildEnvelopePayload(crm){
  return {
    id: crm.id || crm.envelopeId,
    org: crm.organisme || crm.org,
    doc: crm.intituleDocument || crm.doc || crm.document,
    statut: crm.statut || crm.status,
    beneficiaire: crm.beneficiaire || crm.stagiaire || crm.trainee,
    creeLe: crm.creeLe || crm.createdAt,
    sha: crm.hashPdf || crm.sha || crm.sha256 || undefined,
    sigs: (crm.signataires || crm.sigs || []).map(mapSignataire)
  };
}

var Verification = {
  b64urlEncode: b64urlEncode,
  b64urlDecode: b64urlDecode,
  encodePayload: encodePayload,
  decodePayload: decodePayload,
  normalizePayload: normalizePayload,
  buildLegacyHashPayload: buildLegacyHashPayload,
  buildLegacyHashUrl: buildLegacyHashUrl,
  buildVerificationUrl: buildVerificationUrl,
  buildEnvelopePayload: buildEnvelopePayload,
  mapSignataire: mapSignataire,
  esc: esc
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = Verification;
}

if(typeof window !== 'undefined'){
  window.Verification = Verification;
}
