import { api } from "@/lib/axios";
import type { Task } from "@/types/task";

export async function getProjectTasks(projectId: string, accessToken: string) {
  const response = await api.get<Task[]>(`/api/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
