"use client";

import { useQuery } from "@tanstack/react-query";

import { getFolders } from "../services/folder.service";
import { folderQueryKeys } from "./folder-query-keys";

export function useFolders() {
  return useQuery({
    queryKey: folderQueryKeys.lists(),
    queryFn: getFolders,
  });
}
