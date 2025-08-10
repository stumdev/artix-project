// lib/api.ts
export async function api(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Admin-Token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || '',
    ...(opts.headers as Record<string, string> || {}),
  };
  const url = (process.env.NEXT_PUBLIC_API_URL || '') + path;
  const res = await fetch(url, { ...opts, headers, cache: 'no-store' });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (res.status === 204) return {};
  return res.json();
}

// ---- Admin: Keys ----
export const Keys = {
  list: (q: URLSearchParams) => api(`/admin/keys?${q.toString()}`),
  create: (payload: { keygen_id: number; count: number }) =>
    api(`/admin/keys`, { method: 'POST', body: JSON.stringify(payload) }),
  ban:   (id: number) => api(`/admin/keys/${id}/ban`,   { method: 'POST' }),
  unban: (id: number) => api(`/admin/keys/${id}/unban`, { method: 'POST' }),
  reset: (id: number) => api(`/admin/keys/${id}/reset`, { method: 'POST' }),
  revoke:(id: number) => api(`/admin/keys/${id}/revoke`,{ method: 'POST' }),
  del:   (id: number) => api(`/admin/keys/${id}`,       { method: 'DELETE' }),
};

// ---- Admin: Products ----
export const Products = {
  list: () => api(`/admin/products`),
  create: (payload: any) => api(`/admin/products`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => api(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  del: (id: number) => api(`/admin/products/${id}`, { method: 'DELETE' }),
};

// ---- Admin: Keygens ----
export const Keygens = {
  list: () => api(`/admin/keygens`),
  create: (payload: any) => api(`/admin/keygens`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => api(`/admin/keygens/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  del: (id: number) => api(`/admin/keygens/${id}`, { method: 'DELETE' }),
};

// ---- Admin/Utils: Plugin validation page helper (safe stub) ----
export const Plugin = {
  check: (payload: { code: string }) => api(`/plugin/check`, { method: 'POST', body: JSON.stringify(payload) }),
};
