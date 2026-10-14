"use client";

import {
  clearSession,
  getAccessToken,
  getAuthUser,
  getRefreshToken,
  setAuthUser,
  setSession,
} from "@/features/auth/storage/auth-storage";
import {
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
} from "@/features/auth/services/auth.service";
import { setOnSessionExpired } from "@/lib/axios";
import type { AuthUser } from "@/features/auth/types/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    setOnSessionExpired(handleSessionExpired);

    try {
      const storedUser = getAuthUser();
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (storedUser && (accessToken || refreshToken)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(storedUser);
      } else {
        clearSession();
      }
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }

    return () => {
      setOnSessionExpired(() => {});
    };
  }, [handleSessionExpired]);

  async function login(email: string, password: string) {
    const response = await loginUser(email, password);

    setSession(response.user, response.accessToken, response.refreshToken);
    setUser(response.user);
  }

  async function register(name: string, email: string, password: string) {
    const response = await registerUser(name, email, password);

    setSession(response.user, response.accessToken, response.refreshToken);
    setUser(response.user);
  }

  async function logout() {
    const refreshToken = getRefreshToken();

    clearSession();
    setUser(null);

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch {
    } finally {
      router.replace("/login");
    }
  }

  function updateUser(updatedUser: AuthUser) {
    setAuthUser(updatedUser);
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
