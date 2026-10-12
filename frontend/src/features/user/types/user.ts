import { AuthUser } from "@/features/auth/types/auth";

export interface UserProfile extends AuthUser {
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  user: UserProfile;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface ChangePasswordData {
  curPassword: string;
  newPassword: string;
}
