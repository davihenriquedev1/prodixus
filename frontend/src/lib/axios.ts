import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearSession,
} from "@/features/auth/storage/auth-storage";
import { refreshToken } from "@/features/auth/services/auth.service";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

let refreshPromise: Promise<string> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(callback: () => void) {
  onSessionExpired = callback;
}

function expireSession() {
  clearSession();
  onSessionExpired?.();
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableRequestConfig;

    if (error.response?.status !== 401 || !config || config._retry) {
      return Promise.reject(error);
    }

    if (config.url?.includes("/api/auth/refresh")) {
      expireSession();
      return Promise.reject(error);
    }

    config._retry = true;

    const storedRefreshToken = getRefreshToken();

    if (!storedRefreshToken) {
      expireSession();
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshToken(storedRefreshToken)
          .then(({ accessToken, refreshToken: newRefreshToken }) => {
            setTokens(accessToken, newRefreshToken);
            return accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const accessToken = await refreshPromise;

      config.headers.Authorization = `Bearer ${accessToken}`;

      return api(config);
    } catch (refreshError) {
      expireSession();
      return Promise.reject(refreshError);
    }
  },
);
