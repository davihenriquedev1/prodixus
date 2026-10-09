"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/projects/services/project.service";
import { projectQueryKeys } from "./project.query-keys";

export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.list(),
    queryFn: getProjects,
  });
}
