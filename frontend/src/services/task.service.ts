import axios from "axios";
import type { Task } from "@/types/task";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getProjectTasks(projectId: string, accessToken: string) {
  const response = await api.get<Task[]>(`/api/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
