const baseUrl = 'http://10.134.98.189:4001';

export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

export const API = {
  health: () => fetchJSON('/health'),
  listings: () => fetchJSON('/api/listings'),
};
