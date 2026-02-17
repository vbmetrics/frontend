import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  // LOGIKA PRZEKIEROWAŃ (DLA STRON UI)
  if (!token && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone();
    const next = url.pathname + (url.search || "");
    const redirect = new URL("/", req.url);
    
    redirect.searchParams.set("signin", "1");
    redirect.searchParams.set("next", next);
    return NextResponse.redirect(redirect);
  }

  // LOGIKA AUTORYZACJI API (DLA DANYCH)
  if (token) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

/**
 * Lock down the "app" area AND intercept API calls.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/live/:path*",
    "/matches/:path*",
    "/analytics/:path*",
    "/scouting/:path*",
    "/players/:path*",
    "/data/:path*",
    "/integration/:path*",
    "/account/:path*",
    "/docs/:path*",
    "/changelog/:path*",
    "/feedback/:path*",
    "/api/backend/:path*", 
  ],
};