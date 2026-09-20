import { api } from "@/lib/axios";
import type { Task } from "@/types/task";

export async function getProjectTasks(projectId: string) {
  const response = await api.get<Task[]>(`/api/projects/${projectId}/tasks`);

  return response.data;
}
