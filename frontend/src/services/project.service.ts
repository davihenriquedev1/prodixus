import { api } from "@/lib/axios";
import type { Project } from "@/types/project";

export async function getProjects(accessToken: string) {
  const response = await api.get<Project[]>("/api/projects", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
