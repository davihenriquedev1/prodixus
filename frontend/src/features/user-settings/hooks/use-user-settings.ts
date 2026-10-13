"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserSettings } from "@/features/user-settings/services/user-settings.service";
import { userSettingsQueryKeys } from "./user-settings-query-keys";

interface UseUserSettingsOptions {
  enabled?: boolean;
}

export function useUserSettings({
  enabled = true,
}: UseUserSettingsOptions = {}) {
  return useQuery({
    queryKey: userSettingsQueryKeys.settings(),
    queryFn: getUserSettings,
    enabled,
  });
}
