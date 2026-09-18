"use client";

import {
  clearSession,
  getAuthUser,
  getRefreshToken,
  setSession,
} from "@/features/auth/storage/auth-storage";
import {
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
} from "@/services/auth.service";
import { AuthUser } from "@/types/auth";
import {
  createContext,
  ReactNode,
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getAuthUser();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(storedUser);
    setIsLoading(false);
  }, []);

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

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } finally {
      clearSession();
      setUser(null);
    }
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
