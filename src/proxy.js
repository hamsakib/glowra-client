import { NextResponse } from "next/server";

const TOKEN_COOKIE = "glowra_token";

/** Reads the JWT payload without verifying it: this is only for routing. The API verifies every request. */
function readPayload(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "=")));
  } catch {
    return null;
  }
}

/**
 * Protected routes: /dashboard/** and /checkout need a session; /dashboard/admin/** needs the admin role.
 * Signed-in users visiting /login or /register are sent to their dashboard.
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const payload = token ? readPayload(token) : null;
  const valid = payload?.exp && payload.exp * 1000 > Date.now();

  if (pathname === "/login" || pathname === "/register") {
    return valid ? NextResponse.redirect(new URL("/dashboard", request.url)) : NextResponse.next();
  }

  if (!valid) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    if (token) url.searchParams.set("expired", "1");
    const res = NextResponse.redirect(url);
    if (token) res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard?denied=1", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/login", "/register"],
};
