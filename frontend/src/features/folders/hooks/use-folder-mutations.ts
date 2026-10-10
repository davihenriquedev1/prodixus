"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "../services/folder.service";

import type { CreateFolderData, UpdateFolderData } from "../types/folder";

import { folderQueryKeys } from "./folder-query-keys";

export function useFolderMutations() {
  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: (data: CreateFolderData) => createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: folderQueryKeys.all,
      });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: ({
      folderId,
      data,
    }: {
      folderId: string;
      data: UpdateFolderData;
    }) => updateFolder(folderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: folderQueryKeys.all,
      });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: folderQueryKeys.all,
      });
    },
  });

  return {
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
}
