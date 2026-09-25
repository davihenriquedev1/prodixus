import { api } from "@/lib/axios";
import type { Task } from "@/features/tasks/types/task";

export async function getProjectTasks(projectId: string) {
  const response = await api.get<Task[]>(`/api/projects/${projectId}/tasks`);

  return response.data;
}

export async function getTask(taskId: string) {
  const response = await api.get<Task>(`/api/tasks/${taskId}`);

  return response.data;
}

export async function createTask(data: Partial<Task>) {
  const response = await api.post<Task>("/api/tasks", data);

  return response.data;
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  const response = await api.patch<Task>(`/api/tasks/${taskId}`, data);

  return response.data;
}

export async function deleteTask(taskId: string) {
  await api.delete(`/api/tasks/${taskId}`);
}
