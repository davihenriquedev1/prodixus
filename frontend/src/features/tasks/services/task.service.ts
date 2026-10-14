import { api } from "@/lib/axios";
import type {
  CreateTaskData,
  Task,
  UpdateTaskData,
} from "@/features/tasks/types/task";

export async function getProjectTasks(projectId: string) {
  const response = await api.get<Task[]>(`/api/projects/${projectId}/tasks`);
  return response.data;
}

export async function getTagTasks(tagId: string) {
  const response = await api.get<Task[]>(`/api/tags/${tagId}/tasks`);
  return response.data;
}

export async function getTask(taskId: string) {
  const response = await api.get<Task>(`/api/tasks/${taskId}`);
  return response.data;
}

export async function createTask(data: CreateTaskData) {
  const projectId = data.projectId;
  const response = await api.post<Task>(
    `/api/projects/${projectId}/tasks`,
    data,
  );
  return response.data;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: UpdateTaskData,
) {
  const response = await api.patch<Task>(
    `/api/projects/${projectId}/tasks/${taskId}`,
    data,
  );
  return response.data;
}

export async function deleteTask(projectId: string, taskId: string) {
  await api.delete(`/api/projects/${projectId}/tasks/${taskId}`);
}

export async function addTagToTask(taskId: string, tagId: string) {
  const response = await api.post(`/api/tasks/${taskId}/tags/${tagId}`);

  return response.data;
}

export async function removeTagFromTask(taskId: string, tagId: string) {
  await api.delete(`/api/tasks/${taskId}/tags/${tagId}`);
}
