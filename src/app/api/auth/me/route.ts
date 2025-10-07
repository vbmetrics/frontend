import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;
const API_ME_PATH = process.env.API_ME_PATH || "/api/v1/auth/me";

export async function GET(_req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json({ error: "Missing API_BASE" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = `${API_BASE.replace(/\/+$/, "")}${API_ME_PATH}`;
  const upstream = await fetch(target, {
    headers: { authorization: `Bearer ${token}`, accept: "application/json" },
    cache: "no-store",
  });

  const text = await upstream.text().catch(() => "");
  if (!upstream.ok) {
    // pass through backend error/status
    return new NextResponse(text || "Failed to fetch profile", { status: upstream.status });
  }

  return new NextResponse(text, {
    status: 200,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
}
