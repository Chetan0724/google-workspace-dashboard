import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const apiRoutes = ["/api/auth/google", "/api/auth/callback/google"];

  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("session")?.value;
  const session = sessionToken ? await verifyJWT(sessionToken) : null;
  const isAuthenticated = !!session;

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
