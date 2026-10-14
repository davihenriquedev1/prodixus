"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/user/services/user.service";
import { userQueryKeys } from "./user-query-keys";

export function useUserProfile() {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: getCurrentUser,
  });
}
