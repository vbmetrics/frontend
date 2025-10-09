// src/lib/api/client.ts
type ApiInit = RequestInit;

function toProxyUrl(path: string) {
  // pełny URL — zostaw
  if (/^https?:\/\//i.test(path)) return path;
  // już przez proxy — zostaw
  if (path.startsWith("/api/backend/")) return path;
  // wszystko co leci na backend /api/v1/... przepuść przez proxy
  if (path.startsWith("/api/v1/") || path === "/api/v1" || path.startsWith("/api/v1?")) {
    return `/api/backend${path}`;
  }
  // lokalne Next API (np. /api/auth/...) zostaw
  return path;
}

export async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const url = toProxyUrl(path);

  const res = await fetch(url, {
    // przekaż nagłówki jeśli były, bez wymuszania CT dla GET
    ...init,
  });

  if (!res.ok) {
    let text = "";
    try { text = await res.text(); } catch {}
    throw new Error(`API ${res.status}: ${text}`);
  }

  // 204 → brak JSON
  if (res.status === 204) return undefined as T;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  // fallback (np. tekst)
  return (await res.text() as unknown) as T;
}
