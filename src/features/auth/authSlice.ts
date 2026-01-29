"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "@/lib/constants";
import type { User } from "@/features/auth/types";
import { clearAuthCookies } from "@/lib/cookies";
import { apiSlice } from "@/store/apiSlice";

type AuthState = {
  token: string | null;
  user: User | null;
  role: Role | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  role: null
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.role = (action.payload?.role as Role | undefined) ?? state.role;
    },
    setRole(state, action: PayloadAction<Role | null>) {
      state.role = action.payload;
    },
    logout() {
      clearAuthCookies();
      return initialState;
    }
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

export const logoutAndReset = () => (dispatch: (action: unknown) => void) => {
  dispatch(authActions.logout());
  dispatch(apiSlice.util.resetApiState());
};
