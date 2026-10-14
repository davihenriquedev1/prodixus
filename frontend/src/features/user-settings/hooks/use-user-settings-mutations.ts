"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSettings } from "@/features/user-settings/services/user-settings.service";
import { userSettingsQueryKeys } from "./user-settings-query-keys";

export function useUserSettingsMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserSettings,

    onSuccess: (settings) => {
      queryClient.setQueryData(userSettingsQueryKeys.settings(), settings);
    },
  });
}
