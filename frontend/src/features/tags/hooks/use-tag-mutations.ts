"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTag, updateTag, deleteTag } from "../services/tag.service";

import type { CreateTagData, UpdateTagData } from "../types/tag";
import { tagQueryKeys } from "./tag.query-keys";
import { taskQueryKeys } from "@/features/tasks/hooks/task.query-keys";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/dashboard-query-keys";

export function useTagMutations() {
  const queryClient = useQueryClient();

  const invalidateTags = async () => {
    await queryClient.invalidateQueries({
      queryKey: tagQueryKeys.all,
    });
  };

  const invalidateTasksAndTagsAndDash = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: tagQueryKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
      }),
    ]);
  };

  const createTagMutation = useMutation({
    mutationFn: (data: CreateTagData) => createTag(data),
    onSuccess: invalidateTags,
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: UpdateTagData }) =>
      updateTag(tagId, data),
    onSuccess: async () => {
      await Promise.all([invalidateTags(), invalidateTasksAndTagsAndDash()]);
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: async () => {
      await Promise.all([invalidateTags(), invalidateTasksAndTagsAndDash()]);
    },
  });

  return {
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
}
