"use client";

import { useSyncUserTheme } from "@/features/user-settings/hooks/use-sync-user-theme";

export function UserThemeSync() {
  useSyncUserTheme();

  return null;
}
