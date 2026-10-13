export const userSettingsQueryKeys = {
  all: ["user-settings"] as const,
  settings: () => [...userSettingsQueryKeys.all, "settings"] as const,
};
