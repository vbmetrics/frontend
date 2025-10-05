import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;
const API_LOGOUT_PATH = process.env.API_LOGOUT_PATH || "/api/v1/auth/logout";

export async function POST() {
  const access = (await cookies()).get("access_token")?.value;
  const refresh = (await cookies()).get("refresh_token")?.value;

  // Próba wylogowania po stronie backendu (best-effort)
  try {
    const target = `${API_BASE.replace(/\/+$/, "")}${API_LOGOUT_PATH}`;
    const headers: Record<string, string> = {};
    if (access) headers["authorization"] = `Bearer ${access}`;
    const body = refresh ? JSON.stringify({ refresh_token: refresh }) : undefined;
    const r = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body,
    });
    // Ignorujemy status — i tak wyczyścimy cookies lokalnie
    await r.text().catch(() => {});
  } catch {}

  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  res.cookies.set("refresh_token", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return res;
}

// (opcjonalnie) GET też czyści
export const GET = POST;
