import { api } from "@/lib/axios";
import { CreateTagData, Tag, UpdateTagData } from "../types/tag";

export async function getTags() {
  const response = await api.get<Tag[]>(`/api/tags`);
  return response.data;
}

export async function getTag(tagId: string) {
  const response = await api.get<Tag>(`/api/tags/${tagId}`);
  return response.data;
}

export async function createTag(data: CreateTagData) {
  const response = await api.post<Tag>(`/api/tags`, data);
  return response.data;
}

export async function updateTag(tagId: string, data: UpdateTagData) {
  const response = await api.patch<Tag>(`/api/tags/${tagId}`, data);
  return response.data;
}

export async function deleteTag(tagId: string) {
  await api.delete<Tag>(`/api/tags/${tagId}`);
}
