export function b64urlEncode(str){
  const b64 = Buffer.from(str, 'utf8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function b64urlDecode(s){
  let norm = s.replace(/-/g, '+').replace(/_/g, '/');
  while(norm.length % 4) norm += '=';
  return Buffer.from(norm, 'base64').toString('utf8');
}

export function esc(x){
  return String(x == null ? '' : x)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function encodePayload(obj){
  return b64urlEncode(JSON.stringify(obj));
}

export function decodePayload(encoded){
  return JSON.parse(b64urlDecode(encoded));
}

export function buildVerificationUrl(baseUrl, data, mode = 'id'){
  const root = baseUrl.replace(/\/?$/, '/');
  if(mode === 'hash'){
    return root + '#d=' + encodePayload(data);
  }
  if(!data.id) throw new Error('data.id is required for id mode');
  return root + '?id=' + encodeURIComponent(data.id);
}

export function mapSignataire(s){
  return {
    n: s.nom || s.n || s.name,
    r: s.role || s.r || '',
    d: s.signeLe || s.dateHeureEnregistree || s.d || s.signedAt || '',
    e: s.email || s.e || undefined,
    ip: s.ip || undefined
  };
}

export function buildEnvelopePayload(crm){
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
