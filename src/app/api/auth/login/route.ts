import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const API_LOGIN_PATH = process.env.API_LOGIN_PATH || "/api/v1/auth/login";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const target = `${API_BASE.replace(/\/+$/, "")}${API_LOGIN_PATH}`;
  const r = await fetch(target, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    return new NextResponse(msg || "Login failed", { status: r.status });
  }

  const data = await r.json();
  const access =
    data?.access_token ?? data?.token ?? data?.access?.token ?? null;
  const refresh =
    data?.refresh_token ?? data?.refresh?.token ?? null;

  if (!access) {
    return NextResponse.json({ error: "No access token in response" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", access, {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production", path: "/",
  });
  if (refresh) {
    res.cookies.set("refresh_token", refresh, {
      httpOnly: true, sameSite: "lax",
      secure: process.env.NODE_ENV === "production", path: "/",
    });
  }
  return res;
}
