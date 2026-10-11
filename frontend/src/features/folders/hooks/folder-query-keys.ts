export const folderQueryKeys = {
  all: ["folders"] as const,
  lists: () => [...folderQueryKeys.all, "list"] as const,
  details: () => [...folderQueryKeys.all, "detail"] as const,
  detail: (folderId: string) =>
    [...folderQueryKeys.details(), folderId] as const,
};
