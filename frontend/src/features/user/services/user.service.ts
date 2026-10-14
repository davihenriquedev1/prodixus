import { api } from "@/lib/axios";
import {
  ChangePasswordData,
  UpdateProfileData,
  UserProfile,
  UserProfileResponse,
} from "../types/user";

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get<UserProfileResponse>("/api/users/me");
  return response.data.user;
}

export async function updateProfile(data: UpdateProfileData) {
  const response = await api.patch<UserProfileResponse>("/api/users/me", data);

  return response.data.user;
}

export async function changePassword(data: ChangePasswordData) {
  await api.patch("/api/users/me/password", data);
}
