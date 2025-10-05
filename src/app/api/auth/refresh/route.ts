import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;
const API_REFRESH_PATH = process.env.API_REFRESH_PATH || "/api/v1/auth/refresh";

export async function POST() {
  const refresh = (await cookies()).get("refresh_token")?.value;
  if (!refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const target = `${API_BASE.replace(/\/+$/, "")}${API_REFRESH_PATH}`;
  const r = await fetch(target, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!r.ok) {
    // Nie czyścimy refresh od razu — zostawiamy decyzję UI
    return new NextResponse(await r.text().catch(() => "Refresh failed"), { status: r.status });
  }

  const data = await r.json();
  const access =
    data?.access_token ?? data?.token ?? data?.access?.token ?? null;
  const newRefresh =
    data?.refresh_token ?? data?.refresh?.token ?? null;

  if (!access) {
    return NextResponse.json({ error: "No access token in refresh response" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", access, {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production", path: "/",
  });
  if (newRefresh) {
    res.cookies.set("refresh_token", newRefresh, {
      httpOnly: true, sameSite: "lax",
      secure: process.env.NODE_ENV === "production", path: "/",
    });
  }
  return res;
}
