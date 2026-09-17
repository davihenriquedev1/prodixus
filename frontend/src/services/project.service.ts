import axios from "axios";
import type { Project } from "@/types/project";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getProjects(accessToken: string) {
  const response = await api.get<Project[]>("/api/projects", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
