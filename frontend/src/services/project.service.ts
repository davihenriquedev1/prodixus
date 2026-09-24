import { api } from "@/lib/axios";
import type { Project } from "@/types/project";

export interface CreateProjectData {
  name: string;
  estimatedDuration?: number;
  dueAt?: string;
  primaryColor?: string;
  accentColor?: string;
  errorColor?: string;
  folderId?: string;
}

export interface UpdateProjectData {
  name?: string;
  notes?: string;
  completed?: boolean;
  archived?: boolean;
  estimatedDuration?: number;
  dueAt?: string;
  primaryColor?: string;
  accentColor?: string;
  errorColor?: string;
  folderId?: string;
}

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
