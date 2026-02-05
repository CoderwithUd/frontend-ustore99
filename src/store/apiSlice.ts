"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";
import { getAuthTokenCookie } from "@/lib/cookies";

type FetchArgs = Parameters<ReturnType<typeof fetchBaseQuery>>[0];

function normalizeApiUrl(baseUrl: string | undefined, url: string) {
  const base = (baseUrl || "").replace(/\/$/, "");
  if (!base) return url;

  const baseHasApi = base.endsWith("/api");
  const urlHasApi = url.startsWith("/api/");

  if (baseHasApi && urlHasApi) return url.replace(/^\/api/, "");
  return url;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://ustore-y3u2.onrender.com/api/".replace(/\/$/, ""),
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || getAuthTokenCookie();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    if (typeof args === "string") {
      return rawBaseQuery(normalizeApiUrl("https://ustore-y3u2.onrender.com/api/", args), api, extraOptions);
    }
    const nextArgs: FetchArgs = { ...args, url: normalizeApiUrl("https://ustore-y3u2.onrender.com/api/", args.url) };
    return rawBaseQuery(nextArgs, api, extraOptions);
  },
  tagTypes: ["Me", "Products"],
  endpoints: () => ({})
});
