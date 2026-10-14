import { api } from "@/lib/axios";
import type {
  UpdateUserSettingsData,
  UserSettings,
  UserSettingsResponse,
} from "../types/user-settings";

export async function getUserSettings(): Promise<UserSettings> {
  const response = await api.get<UserSettingsResponse>("/api/user-settings");

  return response.data.settings;
}

export async function updateUserSettings(
  data: UpdateUserSettingsData,
): Promise<UserSettings> {
  const response = await api.patch<UserSettingsResponse>(
    "/api/user-settings",
    data,
  );

  return response.data.settings;
}
