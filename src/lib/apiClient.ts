type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('API non configurée: NEXT_PUBLIC_API_URL manquant (doit pointer vers le backend Render)');
  }
  return url.replace(/\/+$/, '');
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getAuthHeader() {
  if (typeof window === 'undefined') return {};

  // Source de vérité: cookie (utilisé par le middleware Next)
  const cookieToken = getCookie('auth-token');
  if (cookieToken) return { Authorization: `Bearer ${cookieToken}` };

  // Fallback legacy
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function withTimeout(init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const signal = init.signal ?? controller.signal;

  return {
    init: { ...init, signal },
    cleanup: () => clearTimeout(timer),
  };
}

export async function apiFetch<T>(path: string, init: RequestInit & { method?: ApiMethod } = {}): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers);

  // Ajoute automatiquement l'Authorization si non explicitement fourni
  if (!headers.has('Authorization') && !headers.has('authorization')) {
    const auth = getAuthHeader() as { Authorization?: string };
    if (auth.Authorization) headers.set('Authorization', auth.Authorization);
  }

  const { init: initWithTimeout, cleanup } = withTimeout(init, 15000);

  try {
    const res = await fetch(url, {
      ...initWithTimeout,
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
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('API injoignable (timeout). Vérifiez que le backend Render tourne et que NEXT_PUBLIC_API_URL est correct.');
    }
    throw err;
  } finally {
    cleanup();
  }
}
