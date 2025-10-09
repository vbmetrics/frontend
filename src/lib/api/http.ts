// src/lib/api/http.ts
const COLLECTION_ENDPOINTS = new Set([
  "arena",
  "season",
  "team",
  "player",
  "player-team-history",
  "staff-member",
  "staff-team-history",
  "match",
  "set",
  "rally",
  "action",
  "special-event",
  "country",
]);

/** Jeśli końcowy segment to kolekcja (patrz powyżej) – dopnij końcowy slash. */
export function withTrailingSlash(path: string) {
  try {
    const [pathname, search = ""] = path.split("?");
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    if (COLLECTION_ENDPOINTS.has(last) && !pathname.endsWith("/")) {
      return `${pathname}/${search ? `?${search}` : ""}`;
    }
    return path;
  } catch {
    return path;
  }
}

export function buildQuery(params?: Record<string, unknown>) {
  const url = new URLSearchParams();
  const p = params && typeof params === "object" ? params : {};

  if (!("skip" in p)) url.set("skip", "0");
  if (!("limit" in p)) url.set("limit", "100");

  for (const [k, v] of Object.entries(p)) {
    if (v === undefined || v === null) continue;
    url.set(k, String(v));
  }
  const s = url.toString();
  return s ? `?${s}` : "";
}

export function buildUrl(
  basePath: string,
  params?: Record<string, string | number | boolean | undefined | null>
) {
  // zawsze zaczynajy od slash
  let path = basePath.startsWith("/") ? basePath : `/${basePath}`;
  // trailing slash przed '?'
  if (!path.endsWith("/")) path += "/";

  const url = new URL(path, typeof window === "undefined" ? "http://localhost" : window.location.origin);
  const sp = url.searchParams;

  // domyślne dla list
  if (!params || params.skip === undefined) sp.set("skip", String(0));
  if (!params || params.limit === undefined) sp.set("limit", String(100));

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      // nie nadpisuj skip/limit jeśli już ustawiliśmy domyślne wyżej
      if ((k === "skip" || k === "limit") && sp.has(k)) continue;
      sp.set(k, String(v));
    }
  }
  // zwróć ścieżkę względną z query (bez hosta)
  return url.pathname + (sp.toString() ? `?${sp.toString()}` : "");
}

