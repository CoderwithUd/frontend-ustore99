"use client";

import { useEffect } from "react";
import { useLazyMeQuery } from "@/features/auth/authApi";
import { authActions } from "@/features/auth/authSlice";
import { getAuthTokenCookie, setAuthCookies } from "@/lib/cookies";
import { decodeJwtPayload } from "@/lib/jwt";
import type { Role } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [triggerMe] = useLazyMeQuery();

  useEffect(() => {
    const cookieToken = getAuthTokenCookie();
    if (!cookieToken) return;
    if (!token) dispatch(authActions.setToken(cookieToken));

    const payload = decodeJwtPayload(cookieToken);
    const role = (payload?.role as Role | undefined) ?? (payload?.userRole as Role | undefined);
    if (role) dispatch(authActions.setRole(role));

    triggerMe()
      .unwrap()
      .then((user) => {
        dispatch(authActions.setUser(user));
        if (user?.role) setAuthCookies({ token: cookieToken, role: user.role });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
