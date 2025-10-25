import 'cross-fetch/polyfill';
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4001';
export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const ctype = res.headers.get('content-type') || '';
  const isJson = ctype.includes('application/json');
  if (!res.ok) {
    const msg = isJson ? (await res.json())?.error || `HTTP ${res.status}` : (await res.text());
    throw new Error(typeof msg === 'string' ? msg : `HTTP ${res.status}`);
  }
  return isJson ? res.json() : res.text();
}
export const API = {
  listings: () => fetchJSON('/api/listings'),
  submitListing: (data, adminKey) => fetchJSON('/api/listings', { method: 'POST', body: JSON.stringify(data), headers: { 'x-admin-key': adminKey } }),
  unlock: (id) => fetchJSON(`/api/listings/unlock/${id}`, { method: 'POST' }),
  paymentsSimulate: (payload) => fetchJSON('/api/payments/simulate', { method: 'POST', body: JSON.stringify(payload) }),
  terms: () => fetchJSON('/api/legal/terms'),
  channels: () => fetchJSON('/api/payments/channels'),
};
