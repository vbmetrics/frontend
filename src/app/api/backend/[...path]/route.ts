import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;

type Ctx = { params: Promise<{ path: string[] }> };

const HOP_BY_HOP = new Set([
  "connection","keep-alive","proxy-authenticate","proxy-authorization","te",
  "trailer","transfer-encoding","upgrade","host",
]);

async function proxy(req: NextRequest, path: string[]) {
  if (!API_BASE) {
    return NextResponse.json({ error: "Missing API_BASE env" }, { status: 500 });
  }

  // 1) Pobierz token z cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  // 2) Zbuduj URL upstream (API)
  const srcUrl = new URL(req.url);
  const base = API_BASE.replace(/\/+$/, "");
  const pathname = path.length ? "/" + path.join("/") : "";
  const targetUrl = new URL(base + pathname);
  targetUrl.search = srcUrl.search; // przekaż query string

  // 3) Zbuduj nagłówki (bez hop-by-hop) + Bearer
  const headers = new Headers();
  req.headers.forEach((v, k) => {
    if (!HOP_BY_HOP.has(k.toLowerCase())) headers.set(k, v);
  });
  headers.set("authorization", `Bearer ${token}`);

  // 4) Body tylko dla metod z ciałem
  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  // 5) KLUCZ: pozwól fetchowi PODĄŻAĆ za 3xx (np. 307 -> / z tym samym body i nagłówkami)
  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "follow", // <— to rozwiązuje problem 307 -> 8000
  });

  // 6) Przepuść sensowne nagłówki odpowiedzi
  const resHeaders = new Headers();
  for (const h of ["content-type","location","www-authenticate","cache-control","etag"]) {
    const v = upstream.headers.get(h);
    if (v) resHeaders.set(h, v);
  }

  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, { status: upstream.status, headers: resHeaders });
}

export async function GET(req: NextRequest, ctx: Ctx)   { const { path } = await ctx.params; return proxy(req, path); }
export async function HEAD(req: NextRequest, ctx: Ctx)  { const { path } = await ctx.params; return proxy(req, path); }
export async function POST(req: NextRequest, ctx: Ctx)  { const { path } = await ctx.params; return proxy(req, path); }
export async function PUT(req: NextRequest, ctx: Ctx)   { const { path } = await ctx.params; return proxy(req, path); }
export async function PATCH(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return proxy(req, path); }
export async function DELETE(req: NextRequest, ctx: Ctx){ const { path } = await ctx.params; return proxy(req, path); }
export async function OPTIONS(req: NextRequest, ctx: Ctx){ const { path } = await ctx.params; return proxy(req, path); }
