import { api } from "@/lib/axios";
import type {
  AuthResponse,
  RefreshTokenResponse,
} from "@/features/auth/types/auth";

export async function login(email: string, password: string) {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
}

export async function refreshToken(refreshToken: string) {
  const response = await api.post<RefreshTokenResponse>("/api/auth/refresh", {
    refreshToken,
  });

  return response.data;
}

export async function logout(refreshToken: string) {
  await api.post("/api/auth/logout", {
    refreshToken,
  });
}
