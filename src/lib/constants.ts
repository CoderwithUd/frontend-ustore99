export const APP_NAME = "Ustore99 Admin";

export const COOKIE_TOKEN_NAME = "ustore99_token";
export const COOKIE_ROLE_NAME = "ustore99_role";

export type Role = "super_admin" | "seller";

export function formatRole(role: Role) {
  return role === "super_admin" ? "SUPER_ADMIN" : "SELLER";
}
