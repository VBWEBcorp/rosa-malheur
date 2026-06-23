import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "dev-only-insecure-secret-replace-in-prod"
    : undefined);

// ─────────────────────────────────────────────────────────────
// Le site est ouvert au public. Le middleware ne sert plus qu'à
// protéger le back-office (/admin) et l'espace client (/account)
// via l'authentification.
// ─────────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    const secureCookie =
      process.env.NODE_ENV === "production" || req.nextUrl.protocol === "https:";
    const token = await getToken({ req, secret: AUTH_SECRET, secureCookie });

    if (pathname.startsWith("/admin")) {
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      if (token.role !== "admin") return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/account") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Seules les zones protégées passent par le middleware.
  matcher: ["/admin/:path*", "/account/:path*"],
};
