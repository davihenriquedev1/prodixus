export type Theme = "light" | "dark" | "system";

export interface UserSettings {
  theme: Theme;
  updatedAt: string;
}

export interface UserSettingsResponse {
  settings: UserSettings;
}

export interface UpdateUserSettingsData {
  theme: Theme;
}
