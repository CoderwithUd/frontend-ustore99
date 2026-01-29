"use client";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/store/apiSlice";
import { authReducer } from "@/features/auth/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
  });

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
