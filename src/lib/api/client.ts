// src/lib/api/client.ts
import { cookies as nextCookies } from "next/headers";

function buildUrl(path: string) {
  const p = path.replace(/^\/+/, "");
  if (typeof window === "undefined") {
    const base =
      process.env.NEXT_PUBLIC_BASE ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    return `${base}/api/backend/${p}`;
  }
  return `/api/backend/${p}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);

  // SSR: dołącz ciasteczka użytkownika do requestu wewnętrznego
  let headers = new Headers(init?.headers as HeadersInit | undefined);
  if (typeof window === "undefined") {
    const cookieStore = await nextCookies();               // <-- ważne: await
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) headers.set("cookie", cookieHeader);
  }

  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
