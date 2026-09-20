import { api } from "@/lib/axios";
import type { Folder } from "@/types/folder";

export async function getFolders() {
  const response = await api.get<Folder[]>("/api/folders");
  return response.data;
}
