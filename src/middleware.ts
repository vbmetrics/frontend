import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    const next = url.pathname + (url.search || "");
    const redirect = new URL("/", req.url);
    // tell landing to open Sign in and keep original destination
    redirect.searchParams.set("signin", "1");
    redirect.searchParams.set("next", next);
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next();
}

/**
 * Lock down the "app" area.
 * Add more segments here as you grow the internal app.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/data/:path*",
    "/live/:path*",
    // add more internal sections as needed:
    // "/teams/:path*",
    // "/matches/:path*",
  ],
};
