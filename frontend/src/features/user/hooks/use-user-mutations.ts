"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/auth.context";
import {
  changePassword,
  updateProfile,
} from "@/features/user/services/user.service";
import { userQueryKeys } from "./user-query-keys";

export function useUserMutations() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.profile(), user);
      updateUser({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
  });

  return {
    updateProfile: updateProfileMutation,
    changePassword: changePasswordMutation,
  };
}
