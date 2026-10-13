"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { useAuth } from "@/features/auth/context/auth.context";
import { useUserSettings } from "@/features/user-settings/hooks/use-user-settings";

export function useSyncUserTheme() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const { data: settings, isSuccess } = useUserSettings({
    enabled: !isAuthLoading && isAuthenticated,
  });

  const { setTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated || !isSuccess || !settings) {
      return;
    }

    setTheme(settings.theme);
  }, [isAuthenticated, isSuccess, settings, setTheme]);
}
