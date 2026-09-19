import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearSession,
} from "@/features/auth/storage/auth-storage";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const config = error.config as RetryableRequestConfig;

    if (config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearSession();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          refreshToken,
        },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      setTokens(accessToken, newRefreshToken);

      config.headers.Authorization = `Bearer ${accessToken}`;
      return api(config);
    } catch {
      clearSession();
      return Promise.reject(error);
    }
  },
);
