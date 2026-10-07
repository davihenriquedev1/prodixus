import { api } from "@/lib/axios";
import type {
  CreateProjectData,
  Project,
  UpdateProjectData,
} from "@/features/projects/types/project";

export async function getProjects() {
  const response = await api.get<Project[]>("/api/projects");
  return response.data;
}

export async function createProject(data: CreateProjectData) {
  const response = await api.post<Project>("/api/projects", data);
  return response.data;
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectData,
) {
  const response = await api.patch<Project>(`/api/projects/${projectId}`, data);
  return response.data;
}

export async function deleteProject(projectId: string) {
  await api.delete(`/api/projects/${projectId}`);
}
