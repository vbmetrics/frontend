// server route
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // mock – log to server console
  try {
    const data = await req.json();
    console.log("[FEEDBACK]", data);
    // TODO: send to issue tracker / email / database
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
