"use client";

import { apiSlice } from "@/store/apiSlice";
import type { LoginRequest, LoginResponse, User } from "@/features/auth/types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body: { email: body.email, password: body.password }
      }),
      invalidatesTags: ["Me"]
    }),
    me: builder.query<User, void>({
      query: () => "/api/users/me",
      providesTags: ["Me"]
    })
  })
});

export const { useLoginMutation, useMeQuery, useLazyMeQuery } = authApi;
