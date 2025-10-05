// Simple localStorage-backed session store
const KEY = 'vf_sessions_v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save(all) { localStorage.setItem(KEY, JSON.stringify(all)); }

export function createSession({ amount, currency = 'INR', merchantId = 'TESTMERCHANT' }) {
  const orderId = 'BDSDK' + Math.floor(1e12 + Math.random() * 9e12).toString();
  const now = new Date().toISOString();
  const sess = {
    orderId, amount, currency, merchantId,
    status: 'CREATED', // CREATED | IN_PROGRESS | SUCCESS | FAIL | CANCELLED
    method: null, meta: {}, createdAt: now, updatedAt: now
  };
  const all = load();
  all.unshift(sess);
  save(all);
  return sess;
}

export function getSession(orderId) {
  return load().find(s => s.orderId === orderId) || null;
}

export function listSessions(limit = 10) {
  return load().slice(0, limit);
}

export function updateSession(orderId, patch) {
  const all = load();
  const idx = all.findIndex(s => s.orderId === orderId);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  save(all);
  return all[idx];
}
