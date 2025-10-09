// src/app/api/backend/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// np. http://127.0.0.1:8000 – Twój FastAPI
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

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

function ensureTrailingSlash(url: URL) {
  const segs = url.pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1] ?? "";
  if (COLLECTION_ENDPOINTS.has(last) && !url.pathname.endsWith("/")) {
    url.pathname = url.pathname + "/";
  }
}

async function handler(req: NextRequest, ctx: { params: { path: string[] } }) {
  const { search } = req.nextUrl;
  const path = "/" + ((await ctx.params).path?.join("/") ?? "");
  const target = new URL(API_BASE + path + search);

  // 1) unikamy 307 z FastAPI na kolekcjach
  ensureTrailingSlash(target);

  // 2) kopiujemy nagłówki (bez nextowych)
  const headers = new Headers(req.headers);
  headers.delete("x-nextjs-data");
  headers.set("host", target.host);
  headers.set("origin", target.origin);

  const method = req.method;
  let body: ArrayBuffer | undefined;

  // 3) Buforuj body TYLKO gdy trzeba (GET/HEAD bez body).
  if (method !== "GET" && method !== "HEAD") {
    const ab = await req.arrayBuffer();
    body = ab;
    headers.set("content-length", String(ab.byteLength));
    if (!headers.get("content-type")) {
      headers.set("content-type", "application/json");
    }
  }

  // 4) Nie pozwól automatycznie śledzić 3xx (żeby nie trzeba było „odtwarzać” body)
  let upstream = await fetch(target, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  // 5) awaryjnie obsłuż ew. 3xx
  if (upstream.status >= 300 && upstream.status < 400) {
    const loc = upstream.headers.get("location");
    if (loc) {
      const redirected = new URL(loc, API_BASE);
      upstream = await fetch(redirected, { method, headers, body });
    }
  }

  // 6) przekopiuj nagłówki (w tym set-cookie)
  const respHeaders = new Headers(upstream.headers);
  const setCookies = (upstream as any).headers?.getSetCookie?.() as string[] | undefined;
  if (Array.isArray(setCookies)) {
    respHeaders.delete("set-cookie");
    for (const c of setCookies) respHeaders.append("set-cookie", c);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}

export const GET = handler;
export const HEAD = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
