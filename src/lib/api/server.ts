// src/lib/api/server.ts
import "server-only";
import { cookies, headers } from "next/headers";

/**
 * Zwraca absolutny origin (np. https://localhost:3000 albo produkcyjny host).
 * Fallback do NEXT_PUBLIC_APP_URL lub http://localhost:3000.
 */
async function resolveOrigin(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host");
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Fetch po stronie serwera (RSC/Route Handler/Server Action),
 * z doklejeniem absolutnego originu, ciastek i sensownych domyślnych opcji.
 *
 * @param path - może być absolutny (http...) lub względny (/api/...)
 */
export async function apiFetchServer<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const origin = await resolveOrigin();
  const url = path.startsWith("http")
    ? path
    : `${origin}${path.startsWith("/") ? "" : "/"}${path}`;

  const cookieHeader = (await cookies()).toString();

  const res = await fetch(url, {
    ...init,
    cache: init.cache ?? "no-store",
    redirect: init.redirect ?? "follow",
    headers: {
      accept: "application/json",
      cookie: cookieHeader,
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    // Wygodna obsługa 404/401 — pozwoli stronie zrobić notFound()
    const text = await res.text().catch(() => "");
    const err = new Error(`API ${res.status}: ${text}`);
    (err as any).status = res.status;
    throw err;
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
