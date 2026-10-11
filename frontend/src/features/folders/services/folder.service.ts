import { api } from "@/lib/axios";
import type {
  CreateFolderData,
  Folder,
  UpdateFolderData,
} from "@/features/folders/types/folder";

export async function createFolder(data: CreateFolderData) {
  const response = await api.post<Folder>(
    "/api/folders",
    data.parentId
      ? { name: data.name, parentId: data.parentId }
      : { name: data.name },
  );

  return response.data;
}

export async function getFolders() {
  const response = await api.get<Folder[]>("/api/folders");
  return response.data;
}

export async function updateFolder(folderId: string, data: UpdateFolderData) {
  const response = await api.patch<Folder>(`/api/folders/${folderId}`, data);
  return response.data;
}

export async function deleteFolder(folderId: string) {
  await api.delete(`/api/folders/${folderId}`);
}
