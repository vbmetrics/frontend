import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;
const API_LOGOUT_PATH = process.env.API_LOGOUT_PATH || "/api/v1/auth/logout";

export async function POST() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;
  const refresh = cookieStore.get("refresh_token")?.value;

  // Best-effort: inform backend to invalidate (if supported)
  if (API_BASE) {
    try {
      const target = `${API_BASE.replace(/\/+$/, "")}${API_LOGOUT_PATH}`;
      await fetch(target, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(access ? { authorization: `Bearer ${access}` } : {}),
        },
        body: refresh ? JSON.stringify({ refresh_token: refresh }) : undefined,
      });
    } catch {
      // ignore network/backend errors on logout
    }
  }

  // Always clear cookies locally
  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  res.cookies.set("refresh_token", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return res;
}

// optional convenience
export const GET = POST;
