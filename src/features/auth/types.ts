import type { Role } from "@/lib/constants";

export type User = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: Role;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  user?: User;
  role?: Role;
};
