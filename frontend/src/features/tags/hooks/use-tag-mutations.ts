"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTag, updateTag, deleteTag } from "../services/tag.service";

import type { CreateTagData, UpdateTagData } from "../types/tag";

export function useTagMutations() {
  const queryClient = useQueryClient();

  const createTagMutation = useMutation({
    mutationFn: (data: CreateTagData) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: UpdateTagData }) =>
      updateTag(tagId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return {
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
}
