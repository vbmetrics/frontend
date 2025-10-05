import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const API_REGISTER_PATH = process.env.API_REGISTER_PATH || "/api/v1/auth/register";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const target = `${API_BASE.replace(/\/+$/, "")}${API_REGISTER_PATH}`;
  const r = await fetch(target, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}
