import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isEnabledLocale, isLocale } from "@/lib/i18n";

/** Session cookie set by the backend on admin sign-in. */
const ADMIN_COOKIE = "esk_admin";

/**
 * Locale routing.
 *
 * - `/en/...`           → served as-is
 * - `/ko/...` (known locale, not yet enabled) → redirected to `/en/...`
 * - `/tours` (no locale) → redirected to `/en/tours`
 *
 * When more locales are enabled, negotiate the target from the
 * `Accept-Language` header here instead of always using DEFAULT_LOCALE.
 *
 * `/admin` is not localized. Visitors without a session cookie are sent to the
 * sign-in page (the API checks the session itself on every request).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login" || request.cookies.has(ADMIN_COOKIE)) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const firstSegment = pathname.split("/")[1] ?? "";

  if (isEnabledLocale(firstSegment)) return NextResponse.next();

  const url = request.nextUrl.clone();
  const rest = isLocale(firstSegment) ? pathname.slice(firstSegment.length + 1) : pathname;
  url.pathname = `/${DEFAULT_LOCALE}${rest === "/" ? "" : rest}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any path with a file extension
  // (images, robots.txt, sitemap.xml, icons).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
