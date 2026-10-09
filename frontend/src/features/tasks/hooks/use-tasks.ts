"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjectTasks } from "@/features/tasks/services/task.service";
import { taskQueryKeys } from "./task.query-keys";

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: taskQueryKeys.project(projectId),
    queryFn: () => getProjectTasks(projectId),
    enabled: Boolean(projectId),
  });
}
