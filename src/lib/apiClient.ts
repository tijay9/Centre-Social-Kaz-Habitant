type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return '';
  return url.replace(/\/+$/, '');
}

function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(path: string, init: RequestInit & { method?: ApiMethod } = {}): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers);
  const auth = getAuthHeader() as { Authorization?: string };
  if (auth.Authorization) headers.set('Authorization', auth.Authorization);

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
