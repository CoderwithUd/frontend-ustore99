import { NextRequest, NextResponse } from "next/server";
import { decodeJwtPayload } from "@/lib/jwt";
import { COOKIE_ROLE_NAME, COOKIE_TOKEN_NAME } from "@/lib/constants";

const sellerBlockedPrefixes = [
  "/admin/orders",
  "/admin/users",
  "/admin/payments",
  "/admin/reports",
  "/admin/settings"
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = req.cookies.get(COOKIE_TOKEN_NAME)?.value;
  const roleCookie = req.cookies.get(COOKIE_ROLE_NAME)?.value;

  if (pathname === "/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/overview";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin" || pathname === "/admin/") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/overview";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const payload = decodeJwtPayload(token);
  const role =
    roleCookie ||
    (payload?.role as string | undefined) ||
    (payload?.userRole as string | undefined);

  if (role === "seller" && sellerBlockedPrefixes.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/overview";
    url.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"]
};
