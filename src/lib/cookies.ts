"use client";

import Cookies from "js-cookie";
import { COOKIE_ROLE_NAME, COOKIE_TOKEN_NAME } from "@/lib/constants";

// Preferred: HttpOnly cookies set by backend on login.
// Fallback (implemented here): client-set cookies to support middleware route protection.
// Backend must still validate JWT + role for real security.
export function getAuthTokenCookie() {
  return Cookies.get(COOKIE_TOKEN_NAME) ?? null;
}

export function setAuthCookies(input: { token: string; role?: string; rememberMe?: boolean }) {
  const secure = typeof window !== "undefined" ? window.location.protocol === "https:" : true;
  const options = {
    sameSite: "Lax" as const,
    secure,
    ...(input.rememberMe ? { expires: 7 } : {})
  };
  Cookies.set(COOKIE_TOKEN_NAME, input.token, options);
  if (input.role) {
    Cookies.set(COOKIE_ROLE_NAME, input.role, options);
  }
}

export function clearAuthCookies() {
  Cookies.remove(COOKIE_TOKEN_NAME);
  Cookies.remove(COOKIE_ROLE_NAME);
}
