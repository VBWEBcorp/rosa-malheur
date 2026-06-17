import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "dev-only-insecure-secret-replace-in-prod"
    : undefined);

// ─────────────────────────────────────────────────────────────
// Mode « coming soon » : tant que COMING_SOON n'est pas "false",
// le public est renvoyé vers /coming-soon. On laisse passer le
// back-office (/admin), la connexion, l'API et la page splash
// elle-même. Aperçu privé du vrai site : ?preview=<COMING_SOON_BYPASS>.
// Pour ouvrir la boutique : COMING_SOON=false (puis redeploy).
// ─────────────────────────────────────────────────────────────
const COMING_SOON = process.env.COMING_SOON !== "false";
const BYPASS_SECRET = process.env.COMING_SOON_BYPASS || "rosamalheur";
const BYPASS_COOKIE = "rm_preview";

/** Chemins jamais masqués par le coming soon (hors /admin et /account, gérés via l'auth). */
function isAllowedDuringComingSoon(pathname: string): boolean {
  return (
    pathname === "/coming-soon" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/mot-de-passe-oublie") ||
    pathname.startsWith("/reinitialiser-mot-de-passe")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Zones protégées par l'authentification (inchangé).
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
    return NextResponse.next();
  }

  // 2) Mode coming soon pour le reste du site public.
  if (COMING_SOON) {
    // Activation de l'aperçu privé : ?preview=<secret> → pose un cookie.
    const preview = req.nextUrl.searchParams.get("preview");
    if (preview === BYPASS_SECRET) {
      const url = req.nextUrl.clone();
      url.searchParams.delete("preview");
      const res = NextResponse.redirect(url);
      res.cookies.set(BYPASS_COOKIE, "1", {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      });
      return res;
    }

    const hasBypass = req.cookies.get(BYPASS_COOKIE)?.value === "1";
    if (!hasBypass && !isAllowedDuringComingSoon(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/coming-soon";
      url.search = "";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Tout sauf l'API, les internes Next et les fichiers statiques (contenant un point).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
