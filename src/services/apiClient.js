const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'smartserve_tokens';

export const tokenStore = {
  get: () => {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: (tokens) => localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

function extractErrorMessage(data) {
  if (!data) return 'Something went wrong';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const value = data[firstKey];
    return Array.isArray(value) ? value[0] : String(value);
  }
  return 'Something went wrong';
}

async function refreshAccessToken() {
  const tokens = tokenStore.get();
  if (!tokens?.refresh) return null;

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) {
    tokenStore.clear();
    return null;
  }
  const data = await res.json();
  const updated = { ...tokens, access: data.access };
  tokenStore.set(updated);
  return updated.access;
}

export async function apiRequest(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const tokens = tokenStore.get();
    if (tokens?.access) headers.Authorization = `Bearer ${tokens.access}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      return apiRequest(path, { method, body, auth, retry: false });
    }
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(extractErrorMessage(data));
  }
  return data;
}
