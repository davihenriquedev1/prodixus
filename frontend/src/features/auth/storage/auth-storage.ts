import type { AuthUser } from "@/features/auth/types/auth";

const ACCESS_TOKEN_KEY = "prodixus_access_token";
const REFRESH_TOKEN_KEY = "prodixus_refresh_token";
const AUTH_USER_KEY = "prodixus_auth_user";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const user = localStorage.getItem(AUTH_USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user) as AuthUser;
}

export function setSession(
  user: AuthUser,
  accessToken: string,
  refreshToken: string,
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}
